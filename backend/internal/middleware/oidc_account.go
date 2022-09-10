package middleware

import (
	"github.com/MISW/Portal/backend/internal/cookies"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
	"golang.org/x/xerrors"
)

// NewOIDCAccountMiddleware - OIDCAccountMiddlewareを初期化する
func NewOIDCAccountMiddleware(su usecase.SessionUsecase) OIDCAccountMiddleware {
	return &oidcAccountMiddleware{
		su: su,
	}
}

// OIDCAccountMiddleware - echoの認証middleware
type OIDCAccountMiddleware interface {
	Authenticate(next echo.HandlerFunc) echo.HandlerFunc
}

type oidcAccountMiddleware struct {
	su usecase.SessionUsecase
}

// Authenticate - 「oidcログイン済み」 かつ 「ポータルでアカウントを持っていない」　ユーザーのみ許可する.
func (m *oidcAccountMiddleware) Authenticate(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		ck, err := c.Cookie(cookies.TokenCookieKey)
		if err != nil {
			return rest.RespondMessage(
				c,
				rest.NewUnauthorized("ログインしていません"),
			)
		}

		user, err := m.su.ValidateOIDC(c.Request().Context(), ck.Value)
		if err, ok := err.(rest.ErrorResponse); ok {
			return rest.RespondMessage(c, err)
		}
		if err != nil {
			return xerrors.Errorf("failed to validate token: %w", err)
		}

		c.Set(OIDCAccountInfoKey, user)

		return next(c)
	}
}
