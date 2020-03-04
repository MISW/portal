package usecase

import (
	"bytes"
	"context"
	"fmt"
	"path"
	"strconv"
	"strings"
	"time"

	"github.com/MISW/Portal/backend/config"
	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/email"
	"github.com/MISW/Portal/backend/internal/jwt"
	"github.com/MISW/Portal/backend/internal/oidc"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/internal/tokenutil"
	"golang.org/x/xerrors"
)

// SessionUsecase - login/signup/logoutなどのセッション周りの処理
type SessionUsecase interface {
	// SignUp - ユーザ新規登録
	Signup(ctx context.Context, user *domain.User) error

	// Login - OpenID ConnectのリダイレクトURLを生成する
	Login(ctx context.Context) (redirectURL, state string, err error)

	// Callback - OpenID Connectでのcallbackを受け取る
	Callback(ctx context.Context, expectedState, actualState, code string) (token string, err error)

	// Logout - トークンを無効化する
	Logout(ctx context.Context, token string) error

	// Validate - トークンの有効性を検証しユーザを取得する
	Validate(ctx context.Context, token string) (user *domain.User, err error)

	// VerifyEmail - Eメール認証用のトークンを受け取ってログイン用トークンを返す
	VerifyEmail(ctx context.Context, verifyToken string) (token string, err error)
}

// NewSessionUsecase - ユーザ関連のユースケースを初期化
func NewSessionUsecase(
	userRepository repository.UserRepository,
	tokenRepository repository.TokenRepository,
	authenticator oidc.Authenticator,
	mailer email.Sender,
	mailTemplates *config.EmailTemplates,
	jwtProvider jwt.JWTProvider,
	baseURL string,
) SessionUsecase {
	return &sessionUsecase{
		userRepository:             userRepository,
		tokenRepository:            tokenRepository,
		authenticator:              authenticator,
		mailer:                     mailer,
		emailVerificationTemplates: mailTemplates.EmailVerification,
		jwtProvider:                jwtProvider,
		baseURL:                    baseURL,
	}
}

type sessionUsecase struct {
	userRepository             repository.UserRepository
	tokenRepository            repository.TokenRepository
	authenticator              oidc.Authenticator
	mailer                     email.Sender
	emailVerificationTemplates *config.EmailTemplate
	jwtProvider                jwt.JWTProvider
	baseURL                    string
}

var _ SessionUsecase = &sessionUsecase{}

// SignUp - ユーザ新規登録
func (us *sessionUsecase) Signup(ctx context.Context, user *domain.User) error {
	user.SlackID = ""
	user.Role = domain.EmailUnverified

	if err := user.Validate(); err != nil {
		return err
	}

	id, err := us.userRepository.Insert(ctx, user)

	if xerrors.Is(err, domain.ErrEmailConflicts) {
		return rest.NewBadRequest("メールアドレスが既に利用されています")
	}

	if err != nil {
		return xerrors.Errorf("failed to insert new user: %w", err)
	}

	token, err := us.jwtProvider.GenerateWithMap(map[string]interface{}{
		"kind": "email_verification",
		"uid":  strconv.Itoa(id),
	})

	if err != nil {
		return xerrors.Errorf("failed to generate token for email verification: %w", err)
	}

	metadata := map[string]string{
		"VerificationLink": path.Join(us.baseURL, "/email_verification?token="+token),
	}

	subject := bytes.NewBuffer(nil)
	body := bytes.NewBuffer(nil)

	if err := us.emailVerificationTemplates.SubjectTemplate.Execute(subject, metadata); err != nil {
		return xerrors.Errorf("failed to execute the template for the subject: %w", err)
	}
	if err := us.emailVerificationTemplates.BodyTeamplte.Execute(body, metadata); err != nil {
		return xerrors.Errorf("failed to execute the template for the body: %w", err)
	}

	if err := us.mailer.Send(user.Email, subject.String(), body.String()); err != nil {
		return xerrors.Errorf("failed to send email to verify the email address(%s): %w", user.Email, err)
	}

	return nil
}

// Login - OpenID ConnectのリダイレクトURLを生成する
func (us *sessionUsecase) Login(ctx context.Context) (redirectURL, state string, err error) {
	url, state, err := us.authenticator.Login(ctx)

	if err != nil {
		return "", "", xerrors.Errorf("failed to generate redirect url for OpenID Connect: %w", err)
	}

	return url, state, nil
}

const (
	auth0Prefix = "oauth2|slack|"
)

// Callback - OpenID Connectでのcallbackを受け取る
func (us *sessionUsecase) Callback(ctx context.Context, expectedState, actualState, code string) (token string, err error) {
	res, err := us.authenticator.Callback(ctx, expectedState, actualState, code)

	if err != nil {
		return "", xerrors.Errorf("failed to verify your token: %w", err)
	}

	if !strings.HasPrefix(res.IDToken.Subject, auth0Prefix) {
		return "", xerrors.Errorf("sub is invalid: %s", res.IDToken.Subject)
	}

	slackID := strings.TrimPrefix(res.IDToken.Subject, auth0Prefix)

	user, err := us.userRepository.GetBySlackID(ctx, slackID)

	if err != nil {
		return "", xerrors.Errorf("failed to find user account associated with SlackID(%s): %w", slackID, err)
	}

	token, err = tokenutil.GenerateRandomToken()

	if err != nil {
		return "", xerrors.Errorf("failed to generate token: %w", err)
	}

	err = us.tokenRepository.Add(ctx, user.ID, token, time.Now().Add(10*24*time.Hour))

	if err != nil {
		return "", xerrors.Errorf("failed to insert new token: %w", err)
	}

	return token, nil
}

// Logout - トークンを無効化する
func (us *sessionUsecase) Logout(ctx context.Context, token string) error {
	err := us.tokenRepository.Delete(ctx, token)

	if err != nil {
		return xerrors.Errorf("failed to delete the token: %w", err)
	}

	return nil
}

// Validate - トークンの有効性を検証しユーザを取得する
func (us *sessionUsecase) Validate(ctx context.Context, token string) (user *domain.User, err error) {
	tk, err := us.tokenRepository.GetByToken(ctx, token)

	if err == domain.ErrNoToken {
		return nil, rest.NewUnauthorized("トークンが無効です")
	}

	if err != nil {
		return nil, xerrors.Errorf("failed to find token: %w", err)
	}

	user, err = us.userRepository.GetByID(ctx, tk.UserID)

	if err != nil {
		return nil, xerrors.Errorf("failed to find user: %w", err)
	}

	return user, nil
}

// VerifyEmail - メールアドレスの検証(メールに届いたリンクを受け取る)
func (us *sessionUsecase) VerifyEmail(ctx context.Context, verifyToken string) (token string, err error) {
	claims, err := us.jwtProvider.ParseAsMap(verifyToken)

	if err != nil {
		return "", rest.NewBadRequest(
			fmt.Sprintf("invalid token(%v)", err),
		)
	}

	if claims["kind"] != "email_verification" {
		return "", rest.NewBadRequest(
			fmt.Sprintf("invalid token(%v)", err),
		)
	}

	uidString, ok := claims["uid"].(string)

	if !ok {
		return "", rest.NewBadRequest("invalid token")
	}

	uid, err := strconv.Atoi(uidString)

	if err != nil {
		return "", rest.NewBadRequest("invalid token(invalid character is contained)")
	}

	err = us.userRepository.UpdateRole(ctx, uid, domain.NotMember)

	if err != nil {
		return "", xerrors.Errorf("failed to update user's role: %w", err)
	}

	token, err = tokenutil.GenerateRandomToken()

	if err != nil {
		return "", xerrors.Errorf("failed to generate token: %w", err)
	}

	err = us.tokenRepository.Add(ctx, uid, token, time.Now().Add(10*24*time.Hour))

	if err != nil {
		return "", xerrors.Errorf("failed to insert new token: %w", err)
	}

	return token, nil
}
