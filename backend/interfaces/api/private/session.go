package private

import (
	"errors"
	"fmt"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/internal/cookies"
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
	ck, err := e.Cookie(cookies.TokenCookieKey)

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

	err = s.su.Signup(e.Request().Context(), u, ck.Value)

	var frerr rest.ErrorResponse
	if errors.As(err, &frerr) {
		return rest.RespondMessage(e, frerr)
	}

	if err != nil {
		return fmt.Errorf("signup failed: %w", err)
	}

	return rest.RespondOK(e, nil)
}
