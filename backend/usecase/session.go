package usecase

import (
	"context"
	"fmt"
	"net/url"
	"path"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/email"
	"github.com/MISW/Portal/backend/internal/jwt"
	"github.com/MISW/Portal/backend/internal/oidc"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/internal/tokenutil"
	"github.com/pkg/errors"
	"golang.org/x/xerrors"
)

// SessionUsecase - login/signup/logoutなどのセッション周りの処理
type SessionUsecase interface {
	// SignUp - ユーザ新規登録
	Signup(ctx context.Context, user *domain.User, accountInfo *domain.OIDCAccountInfo) error

	// Login - OpenID ConnectのリダイレクトURLを生成する
	Login(ctx context.Context) (redirectURL, state string, err error)

	// Callback - OpenID Connectでのcallbackを受け取る.
	// ログインに成功したらtokenを返す.
	// DBにアカウントを持っている(signup済み)の場合はhasAccount=trueとなる.
	Callback(ctx context.Context, expectedState, actualState, code string) (token string, hasAccount bool, err error)

	// Logout - トークンを無効化する. LogoutのURLを返す.
	Logout(ctx context.Context, token string) (logoutURL string, err error)

	// LogoutFromOIDC -  OIDCアカウントからLogoutするURLを返す.oidcAccountInfoを格納している場合はそれを消す.
	LogoutFromOIDC(ctx context.Context, token string) (logoutURL string, err error)

	// Validate - トークンの有効性を検証しユーザを取得する
	Validate(ctx context.Context, token string) (user *domain.User, err error)

	// ValidateOIDC - トークンの有効性を検証しoidc infoを取得する
	ValidateOIDC(ctx context.Context, token string) (user *domain.OIDCAccountInfo, err error)

	// VerifyEmail - Eメール認証用のトークンを受け取ってログイン用トークンを返す
	VerifyEmail(ctx context.Context, verifyToken string) (token string, err error)
}

// NewSessionUsecase - ユーザ関連のユースケースを初期化
func NewSessionUsecase(
	accountInfoRepository repository.OIDCAccountInfoRepository,
	userRepository repository.UserRepository,
	tokenRepository repository.TokenRepository,
	authenticator oidc.Authenticator,
	appConfigRpoeisotry repository.AppConfigRepository,
	mailer email.Sender,
	jwtProvider jwt.JWTProvider,
	baseURL string,
) SessionUsecase {
	return &sessionUsecase{
		accountInfoRepository: accountInfoRepository,
		userRepository:        userRepository,
		tokenRepository:       tokenRepository,
		authenticator:         authenticator,
		appConfigRpoeisotry:   appConfigRpoeisotry,
		mailer:                mailer,
		jwtProvider:           jwtProvider,
		baseURL:               baseURL,
	}
}

type sessionUsecase struct {
	accountInfoRepository repository.OIDCAccountInfoRepository
	appConfigRpoeisotry   repository.AppConfigRepository
	userRepository        repository.UserRepository
	tokenRepository       repository.TokenRepository
	authenticator         oidc.Authenticator
	mailer                email.Sender
	jwtProvider           jwt.JWTProvider
	baseURL               string
}

var _ SessionUsecase = &sessionUsecase{}

// SignUp - ユーザ新規登録
func (us *sessionUsecase) Signup(ctx context.Context, user *domain.User, accountInfo *domain.OIDCAccountInfo) error {
	//user account data
	user.AccountID = accountInfo.AccountID
	user.Email = accountInfo.Email
	user.Role = domain.NotMember
	user.EmailVerified = false
	if err := user.Validate(); err != nil {
		return err
	}

	//insert into DB
	id, err := us.userRepository.Insert(ctx, user)
	if errors.Is(err, domain.ErrEmailConflicts) {
		return rest.NewBadRequest("メールアドレスが既に利用されています")
	}
	if err != nil {
		return xerrors.Errorf("failed to insert new user: %w", err)
	}
	user.ID = id

	//delete account_info in memory
	us.accountInfoRepository.Delete(ctx, accountInfo.Token)

	//email verification
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

// Callback - OpenID Connectでのcallbackを受け取る
// ログインに成功したらtokenを返す.
// DBにアカウントを持っている(signup済み)の場合はhasAccount=trueとなる.
// TODO: emailのアップデートもした方が良いかも? しかしその場合、再度email_verificationもした方がいい気がするが...
func (us *sessionUsecase) Callback(ctx context.Context, expectedState, actualState, code string) (token string, hasAccount bool, err error) {
	res, err := us.authenticator.Callback(ctx, expectedState, actualState, code)

	if err != nil {
		return "", false, xerrors.Errorf("failed to verify your token: %w", err)
	}

	// TODO: 雑すぎるンで何とかする
	var avatarURL, avatarThumbnailURL, email string

	if v, ok := res.Profile["picture"]; ok {
		s, ok := v.(string)
		if ok {
			avatarURL = s
		}
	}
	if v, ok := res.Profile["https://misw.jp/thumbnail"]; ok {
		s, ok := v.(string)
		if ok {
			avatarThumbnailURL = s
		}
	}
	if v, ok := res.Profile["email"]; ok {
		s, ok := v.(string)
		if ok {
			email = s
		}
	}

	var avatar *domain.Avatar
	if avatarURL != "" && avatarThumbnailURL != "" {
		avatar = &domain.Avatar{
			URL:          avatarURL,
			ThumbnailURL: avatarThumbnailURL,
		}
	}

	accountID := res.IDToken.Subject

	user, err := us.userRepository.GetByAccountID(ctx, accountID)
	if err != nil {
		//ユーザーがいない場合、Signup時のためにAccountInfoとして利用するために情報を保存しておく
		if err == domain.ErrNoUser {
			token, err = us.handleNoUserCallback(ctx, accountID, email)
			if err != nil {
				return "", false, err
			}
			return token, false, nil
		}
		return "", false, xerrors.Errorf("failed to find user account associated with AccountID(%s): %w", accountID, err)
	}

	token, err = us.handleUserCallback(ctx, user, avatar)
	if err != nil {
		return "", true, err
	}

	return token, true, nil
}

// handleNoUserCallback DBにデータが保存されていないUserのCallbackを取り扱う.
func (us *sessionUsecase) handleNoUserCallback(ctx context.Context, accountID, email string) (string, error) {
	token, err := tokenutil.GenerateRandomToken()
	if err != nil {
		return "", xerrors.Errorf("failed to generate token: %w", err)
	}
	account := domain.NewOIDCAccountInfo(token, accountID, email)
	if err := us.accountInfoRepository.Save(ctx, &account); err != nil {
		return "", err
	}
	return token, nil
}

// handleUserCallback DBにデータが保存されているUserのcallbackを取り扱う
func (us *sessionUsecase) handleUserCallback(ctx context.Context, user *domain.User, avatar *domain.Avatar) (string, error) {
	token, err := tokenutil.GenerateRandomToken()
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

// Logout - トークンを無効化する. LogoutのURLを返す.
func (us *sessionUsecase) Logout(ctx context.Context, token string) (logoutURL string, err error) {
	err = us.tokenRepository.Delete(ctx, token)
	if err != nil {
		return "", xerrors.Errorf("failed to delete the token: %w", err)
	}

	logoutURL, err = us.LogoutFromOIDC(ctx, token)
	if err != nil {
		return "", xerrors.Errorf("failed to generate logout url: %w", err)
	}

	return
}

// LogoutFromOIDC - LogoutのURLを返す.oidcAccountInfoを格納していた場合はそれを消す.
func (us *sessionUsecase) LogoutFromOIDC(ctx context.Context, token string) (logoutURL string, err error) {
	//あったら消す、なかったら何もしない
	us.accountInfoRepository.Delete(ctx, token)

	logoutURL, err = us.authenticator.Logout(ctx)
	if err != nil {
		return "", xerrors.Errorf("failed to generate logout url: %w", err)
	}

	return
}

// Validate - トークンの有効性を検証しDBからユーザを取得する
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

// ValidateOIDC - トークンの有効性を検証しOIDCAccountInfoStorreからAccountInfoを取得する
func (us *sessionUsecase) ValidateOIDC(ctx context.Context, token string) (accountInfo *domain.OIDCAccountInfo, err error) {
	//find account info
	accountInfo, err = us.accountInfoRepository.GetByToken(ctx, token)
	if err != nil {
		//ログイン済みだった場合の処理
		if _, err := us.Validate(ctx, token); err != nil {
			return nil, xerrors.Errorf("failed to validate token: %w", err)
		}
		return nil, rest.NewForbidden("既に存在しているユーザーです")
	}
	return
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
			"invalid token(incorrect claims)",
		)
	}

	if claims.Kind != "email_verification" {
		return "", rest.NewBadRequest(
			fmt.Sprintf("invalid token(%v)", err),
		)
	}

	newEmailVerified := true
	err = us.userRepository.VerifyEmail(ctx, claims.ID, claims.Email)
	if errors.Is(err, domain.ErrEmailAddressChanged) {
		return "", rest.NewBadRequest("Your email address has been changed")
	}
	if err == nil || errors.Is(err, domain.ErrEmailAlreadyVerified) {
		err = nil
		newEmailVerified = false
		//return "", rest.NewConflict("Your email address is already verified") //二重のメアド認証を許さなかい場合
	}

	if err != nil {
		return "", xerrors.Errorf("failed to verify email: %w", err)
	}

	//新しいメアドが認証された場合はその旨をメール送信する.
	if newEmailVerified {
		user, err := us.userRepository.GetByID(ctx, claims.ID)

		if err != nil {
			return "", xerrors.Errorf("failed to find user: %w", err)
		}

		if err := us.sendEmailAfterRegistration(user); err != nil {
			return "", xerrors.Errorf("failed to send email after registration: %w", err)
		}
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
