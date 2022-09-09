package private

import (
	"errors"
	"fmt"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/internal/cookies"
	"github.com/MISW/Portal/backend/internal/middleware"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
)

// SessionHandler - セッション周りの非公開API
type SessionHandler interface {
	Logout(e echo.Context) error
	Signup(e echo.Context) error
}

// NewSessionHandler - SessionHandlerを初期化
func NewSessionHandler(su usecase.SessionUsecase) SessionHandler {
	return &sessionHandler{
		su: su,
	}
}

var _ SessionHandler = &sessionHandler{}

type sessionHandler struct {
	su usecase.SessionUsecase
}

func (s *sessionHandler) Logout(e echo.Context) error {
	ck, err := e.Cookie(cookies.TokenCookieKey)

	if err != nil {
		return rest.RespondMessage(
			e,
			rest.NewUnauthorized("unauthorized"),
		)
	}

	err = s.su.Logout(e.Request().Context(), ck.Value)

	ck.Value = ""
	ck.Expires = time.Now().Add(-1 * time.Hour)
	e.SetCookie(ck)

	return rest.RespondOK(e, nil)
}

func (s *sessionHandler) Signup(e echo.Context) error {
	user := e.Get(middleware.UserKey).(*domain.User)

	var param struct {
		Token string `json:"token" query:"token"`
		Email string `json:"email" query:"email"`
		Sub   string `json:"sub"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest(fmt.Sprintf("token is missing: %v", err)))
	}

	_, err := e.Cookie(cookies.TokenCookieKey)
	if err != nil {
		return rest.RespondMessage(
			e,
			rest.NewUnauthorized("unauthorized"),
		)
	}

	u := &domain.User{}

	if err := e.Bind(u); err != nil {
		return rest.RespondMessage(
			e,
			rest.NewBadRequest(
				fmt.Sprintf("リクエストデータが不正です(%v)", err),
			),
		)
	}

	err = s.su.Signup(e.Request().Context(), u)

	var frerr rest.ErrorResponse
	if errors.As(err, &frerr) {
		return rest.RespondMessage(e, frerr)
	}

	if err != nil {
		return fmt.Errorf("signup failed: %w", err)
	}

	return rest.RespondOK(e, nil)
}
