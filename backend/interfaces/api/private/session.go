package private

import (
	"net/http"
	"time"

	"github.com/MISW/Portal/backend/internal/cookies"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
)

// SessionHandler - セッション周りの非公開API
type SessionHandler interface {
	Logout(e echo.Context) error
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

	return e.NoContent(http.StatusNoContent)
}
