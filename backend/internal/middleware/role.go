package middleware

import (
	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/labstack/echo/v4"
)

// NewRoleValidationMiddleware - RoleValidationMiddlewareを初期化する
func NewRoleValidationMiddleware(allowedRoles ...domain.RoleType) RoleValidationMiddleware {
	return &roleValidationMiddleware{allowedRoles: allowedRoles}
}

// RoleValidationMiddleware - echoのrole検証middleware
type RoleValidationMiddleware interface {
	Authenticate(next echo.HandlerFunc) echo.HandlerFunc
}

type roleValidationMiddleware struct {
	allowedRoles []domain.RoleType
}

func (m *roleValidationMiddleware) Authenticate(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := c.Get(UserKey).(*domain.User)

		ok := false
		for i := range m.allowedRoles {
			if m.allowedRoles[i] == user.Role {
				ok = true

				break
			}
		}

		if !ok {
			return rest.RespondMessage(
				c,
				rest.NewForbidden("permission denied"),
			)
		}

		return next(c)
	}
}
