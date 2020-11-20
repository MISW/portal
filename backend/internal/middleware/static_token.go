package middleware

import (
	"strings"

	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/labstack/echo/v4"
)

// NewStaticTokenAuthMiddleware - 静的なtokenで認証Middlewareを初期化する
func NewStaticTokenAuthMiddleware(tokens []string) echo.MiddlewareFunc {
	tokenSet := map[string]struct{}{}

	for _, token := range tokens {
		tokenSet[token] = struct{}{}
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(e echo.Context) error {
			token := strings.TrimPrefix(e.Request().Header.Get("Authorization"), "Bearer ")

			_, ok := tokenSet[token]

			if !ok {
				return rest.RespondMessage(
					e,
					rest.NewForbidden("no valid token"),
				)
			}

			return next(e)
		}
	}
}
