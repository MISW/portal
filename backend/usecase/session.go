package usecase

import (
	"context"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/oidc"
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

// SignUp - ユーザ新規登録
func (us *sessionUsecase) Signup(ctx context.Context, user *domain.User) error {
	panic("not implemented")
}

// Login - OpenID ConnectのリダイレクトURLを生成する
func (us *sessionUsecase) Login(ctx context.Context) (redirectURL, state string, err error) {
	panic("not implemented")
}

// Callback - OpenID Connectでのcallbackを受け取る
func (us *sessionUsecase) Callback(ctx context.Context, expectedState, actualState, code string) (token string, err error) {
	panic("not implemented")
}

// Logout - トークンを無効化する
func (us *sessionUsecase) Logout(ctx context.Context, token string) error {
	panic("not implemented")
}
