package usecase

import (
	"context"
	"regexp"
	"strings"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/fronterrors"
	"github.com/MISW/Portal/backend/internal/oidc"
	"github.com/MISW/Portal/backend/internal/tokenutil"
	"golang.org/x/xerrors"
)

// SessionUsecase - login/signup/logoutなどのセッション周りの処理
type SessionUsecase interface {
	// SignUp - ユーザ新規登録
	Signup(ctx context.Context, user *domain.User) (token string, err error)

	// Login - OpenID ConnectのリダイレクトURLを生成する
	Login(ctx context.Context) (redirectURL, state string, err error)

	// Callback - OpenID Connectでのcallbackを受け取る
	Callback(ctx context.Context, expectedState, actualState, code string) (token string, err error)

	// Logout - トークンを無効化する
	Logout(ctx context.Context, token string) error

	// Validate - トークンの有効性を検証しユーザを取得する
	Validate(ctx context.Context, token string) (user *domain.User, err error)
}

// NewSessionUsecase - ユーザ関連のユースケースを初期化
func NewSessionUsecase(userRepository repository.UserRepository, tokenRepository repository.TokenRepository, authenticator oidc.Authenticator) SessionUsecase {
	return &sessionUsecase{
		userRepository:  userRepository,
		tokenRepository: tokenRepository,
		authenticator:   authenticator,
	}
}

type sessionUsecase struct {
	userRepository  repository.UserRepository
	tokenRepository repository.TokenRepository
	authenticator   oidc.Authenticator
}

var _ SessionUsecase = &sessionUsecase{}

var (
	emailValidator = regexp.MustCompile(`^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$`)

	invalidWordsForSquads = []string{"\n", "\r"}
)

// SignUp - ユーザ新規登録
func (us *sessionUsecase) Signup(ctx context.Context, user *domain.User) (token string, err error) {
	for i := range user.Squads {
		for j := range invalidWordsForSquads {
			if strings.Contains(user.Squads[i], invalidWordsForSquads[j]) {
				return "", fronterrors.NewBadRequest("班の名前に使えない文字を含んでいます")
			}
		}
	}

	user.SlackID = ""
	user.Role = domain.NotMember

	if user.Sex != domain.Men && user.Sex != domain.Women {
		return "", fronterrors.NewBadRequest("性別の値が不正です")
	}
	if !emailValidator.MatchString(user.Email) {
		return "", fronterrors.NewBadRequest("メールアドレスの形式が不正です")
	}

	id, err := us.userRepository.Insert(ctx, user)

	if xerrors.Is(err, domain.ErrEmailConflicts) {
		return "", fronterrors.NewBadRequest("メールアドレスが既に利用されています")
	}

	if err != nil {
		return "", xerrors.Errorf("failed to insert new user: %w", err)
	}

	token, err = tokenutil.GenerateRandomToken()

	if err != nil {
		return "", xerrors.Errorf("failed to generate token: %w", err)
	}

	err = us.tokenRepository.Add(ctx, id, token, time.Now().Add(10*24*time.Hour))

	if err != nil {
		return "", xerrors.Errorf("failed to insert new token: %w", err)
	}

	return token, nil
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
		return nil, fronterrors.Unauthorized("トークンが無効です")
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
