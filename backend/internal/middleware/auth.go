package middleware

import (
	"github.com/MISW/Portal/backend/internal/cookies"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
	"golang.org/x/xerrors"
)

// NewAuthMiddleware - AuthNMiddlewareを初期化する
func NewAuthMiddleware(su usecase.SessionUsecase) AuthMiddleware {
	return &authMiddleware{
		su: su,
	}
}

// AuthMiddleware - echoの認証middleware
type AuthMiddleware interface {
	Authenticate(next echo.HandlerFunc) echo.HandlerFunc
}

type authMiddleware struct {
	su usecase.SessionUsecase
}

// TODO: Roleで振り分けたり、DBにユーザーがいなかったらSignupに飛ばしたり、など
func (m *authMiddleware) Authenticate(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		ck, err := c.Cookie(cookies.TokenCookieKey)

		if err != nil {
			return rest.RespondMessage(
				c,
				rest.NewUnauthorized("ログインしていません"),
			)
		}

		user, err := m.su.Validate(c.Request().Context(), ck.Value)

		if err, ok := err.(rest.ErrorResponse); ok {
			return rest.RespondMessage(c, err)
		}

		if err != nil {
			return xerrors.Errorf("failed to validate token: %w", err)
		}

		c.Set(UserKey, user)

		return next(c)
	}
}
