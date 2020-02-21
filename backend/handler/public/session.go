package public

import (
	"net/http"
	"time"

	"github.com/MISW/Portal/backend/internal/cookies"
	"github.com/MISW/Portal/backend/internal/fronterrors"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
	"golang.org/x/xerrors"
)

// SessionHandler - セッション周りの非公開API
type SessionHandler interface {
	Login(e echo.Context) error

	Callback(e echo.Context) error
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

func (s *sessionHandler) Login(e echo.Context) error {
	redirectURL, state, err := s.su.Login(e.Request().Context())

	if err != nil {
		return xerrors.Errorf("failed to generate redirect url for OpenID Connect: %w", err)
	}

	cookie := new(http.Cookie)

	cookie.HttpOnly = true
	cookie.Secure = true
	cookie.Name = cookies.StateCookieKey
	cookie.Value = state
	cookie.MaxAge = 300

	e.SetCookie(cookie)

	return e.JSON(http.StatusOK, map[string]string{
		"status":       http.StatusText(http.StatusOK),
		"redirect_url": redirectURL,
	})
}

func (s *sessionHandler) Callback(e echo.Context) error {
	code := e.QueryParam("code")
	state := e.QueryParam("state")

	cookie, err := e.Cookie(cookies.StateCookieKey)

	if err != nil {
		return fronterrors.RespondMessage(
			e,
			fronterrors.NewBadRequest("state is not set"),
		)
	}

	expectedState := cookie.Value

	token, err := s.su.Callback(e.Request().Context(), expectedState, state, code)

	if err != nil {
		e.Logger().Infof("failed to validate token: %w", err)

		return fronterrors.RespondMessage(
			e,
			fronterrors.NewBadRequest("failed to validate token"),
		)
	}

	cookie = new(http.Cookie)

	cookie.HttpOnly = true
	cookie.Secure = true
	cookie.Name = cookies.TokenCookieKey
	cookie.Value = token
	cookie.MaxAge = int(30 * 24 * time.Hour / time.Second)

	e.SetCookie(cookie)

	return e.Redirect(http.StatusTemporaryRedirect, "/")
}
