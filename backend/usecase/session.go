package usecase

import (
	"context"
	"fmt"
	"net/url"
	"path"
	"strings"
	"time"

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
	appConfigRpoeisotry repository.AppConfigRepository,
	mailer email.Sender,
	jwtProvider jwt.JWTProvider,
	baseURL string,
) SessionUsecase {
	return &sessionUsecase{
		userRepository:      userRepository,
		tokenRepository:     tokenRepository,
		authenticator:       authenticator,
		appConfigRpoeisotry: appConfigRpoeisotry,
		mailer:              mailer,
		jwtProvider:         jwtProvider,
		baseURL:             baseURL,
	}
}

type sessionUsecase struct {
	appConfigRpoeisotry repository.AppConfigRepository
	userRepository      repository.UserRepository
	tokenRepository     repository.TokenRepository
	authenticator       oidc.Authenticator
	mailer              email.Sender
	jwtProvider         jwt.JWTProvider
	baseURL             string
}

var _ SessionUsecase = &sessionUsecase{}

// SignUp - ユーザ新規登録
func (us *sessionUsecase) Signup(ctx context.Context, user *domain.User) error {
	user.SlackID = ""
	user.Role = domain.NotMember
	user.SlackInvitationStatus = domain.Never
	user.EmailVerified = false

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
	user.ID = id

	token, err := us.jwtProvider.GenerateWithMap(map[string]interface{}{
		"kind":  "email_verification",
		"id":    user.ID,
		"email": user.Email,
	})

	if err != nil {
		return xerrors.Errorf("failed to generate token for email verification: %w", err)
	}

	u, err := url.Parse(us.baseURL)

	if err != nil {
		return xerrors.Errorf("base url is invalid(%s): %w", us.baseURL, err)
	}

	query := url.Values{}
	query.Add("token", token)

	u.Path = path.Join(u.Path, "/verify_email")
	u.RawQuery = query.Encode()

	metadata := map[string]interface{}{
		"VerificationLink": u.String(),
		"User":             user,
	}

	subject, body, err := us.appConfigRpoeisotry.GetEmailTemplate(domain.EmailVerification)

	if err != nil {
		return xerrors.Errorf("failed to get email template for verification: %w", err)
	}

	subject, body, err = email.GenerateEmailFromTemplate(subject, body, metadata)

	if err != nil {
		return xerrors.Errorf("failed to generate email from template: %w", err)
	}

	if err := us.mailer.Send(user.Email, subject, body); err != nil {
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

	// TODO: 雑すぎるンで何とかする
	var avatarURL, avatarThumbnailURL string

	v, ok := res.Profile["picture"]
	if ok {
		s, ok := v.(string)
		if ok {
			avatarURL = s
		}
	}
	v, ok = res.Profile["https://misw.jp/thumbnail"]
	if ok {
		s, ok := v.(string)
		if ok {
			avatarThumbnailURL = s
		}
	}
	var avatar *domain.Avatar
	if avatarURL != "" && avatarThumbnailURL != "" {
		avatar = &domain.Avatar{
			URL:          avatarURL,
			ThumbnailURL: avatarThumbnailURL,
		}
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

	if avatar != nil {
		user.Avatar = avatar
		err = us.userRepository.Update(ctx, user)
		if err != nil {
			return "", xerrors.Errorf("failed to update avatar: %w", err)
		}
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

type customClaims struct {
	Email string `json:"email"`
	ID    int    `json:"id"`
	Kind  string `json:"kind"`
}

func (c *customClaims) Valid() error {
	return nil
}

// VerifyEmail - メールアドレスの検証(メールに届いたリンクを受け取る)
func (us *sessionUsecase) VerifyEmail(ctx context.Context, verifyToken string) (token string, err error) {
	c, err := us.jwtProvider.ParseAs(verifyToken, &customClaims{})

	if err != nil {
		return "", rest.NewBadRequest(
			fmt.Sprintf("invalid token(%v)", err),
		)
	}

	claims, ok := c.(*customClaims)

	if !ok {
		return "", rest.NewBadRequest(
			fmt.Sprintf("invalid token(incorrect claims)"),
		)
	}

	if claims.Kind != "email_verification" {
		return "", rest.NewBadRequest(
			fmt.Sprintf("invalid token(%v)", err),
		)
	}

	err = us.userRepository.VerifyEmail(ctx, claims.ID, claims.Email)

	if err == domain.ErrEmailAddressChanged {
		return "", rest.NewBadRequest("Your email address has been changed")
	}

	if err != nil {
		return "", xerrors.Errorf("failed to verify email: %w", err)
	}

	user, err := us.userRepository.GetByID(ctx, claims.ID)

	if err != nil {
		return "", xerrors.Errorf("failed to find user: %w", err)
	}

	if err := us.sendEmailAfterRegistration(user); err != nil {
		return "", xerrors.Errorf("failed to send email after registration: %w", err)
	}

	token, err = tokenutil.GenerateRandomToken()

	if err != nil {
		return "", xerrors.Errorf("failed to generate token: %w", err)
	}

	err = us.tokenRepository.Add(ctx, claims.ID, token, time.Now().Add(10*24*time.Hour))

	if err != nil {
		return "", xerrors.Errorf("failed to insert new token: %w", err)
	}

	return token, nil
}

func (us *sessionUsecase) sendEmailAfterRegistration(user *domain.User) error {
	metadata := map[string]interface{}{
		"User": user,
	}

	subject, body, err := us.appConfigRpoeisotry.GetEmailTemplate(domain.AfterRegistration)

	if err != nil {
		return xerrors.Errorf("failed to get email template for verification: %w", err)
	}

	subject, body, err = email.GenerateEmailFromTemplate(subject, body, metadata)

	if err != nil {
		return xerrors.Errorf("failed to generate email from template: %w", err)
	}

	if err := us.mailer.Send(user.Email, subject, body); err != nil {
		return xerrors.Errorf("failed to send email to verify the email address(%s): %w", user.Email, err)
	}

	return nil
}
