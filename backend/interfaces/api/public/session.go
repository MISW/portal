package public

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/internal/cookies"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
	"golang.org/x/xerrors"
)

// SessionHandler - セッション周りの非公開API
type SessionHandler interface {
	Login(e echo.Context) error

	Callback(e echo.Context) error

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

func insecureCookie() bool {
	ck := os.Getenv("INSECURE_COOKIE")

	return ck == "1" || strings.ToLower(ck) == "true"
}

func (s *sessionHandler) Login(e echo.Context) error {
	redirectURL, state, err := s.su.Login(e.Request().Context())

	if err != nil {
		return xerrors.Errorf("failed to generate redirect url for OpenID Connect: %w", err)
	}

	cookie := new(http.Cookie)

	if !insecureCookie() {
		cookie.HttpOnly = true
		cookie.Secure = true
	}

	cookie.Name = cookies.StateCookieKey
	cookie.Value = state
	cookie.MaxAge = 300

	e.SetCookie(cookie)

	return rest.RespondOK(
		e,
		map[string]interface{}{
			"redirect_url": redirectURL,
		},
	)
}

func (s *sessionHandler) Callback(e echo.Context) error {
	type OAuth2Param struct {
		Code  string `json:"code" query:"code"`
		State string `json:"state" query:"state"`
	}
	oauth2Param := &OAuth2Param{}

	if err := e.Bind(oauth2Param); err != nil {
		return rest.RespondMessage(
			e,
			rest.NewBadRequest("code and state is not set"),
		)
	}

	cookie, err := e.Cookie(cookies.StateCookieKey)

	if err != nil {
		return rest.RespondMessage(
			e,
			rest.NewBadRequest("state is not set"),
		)
	}

	expectedState := cookie.Value

	token, err := s.su.Callback(e.Request().Context(), expectedState, oauth2Param.State, oauth2Param.Code)

	if err != nil {
		e.Logger().Infof("failed to validate token: %+v", err)

		return rest.RespondMessage(
			e,
			rest.NewBadRequest("failed to validate token"),
		)
	}

	cookie = new(http.Cookie)

	if !insecureCookie() {
		cookie.HttpOnly = true
		cookie.Secure = true
	}

	cookie.Name = cookies.TokenCookieKey
	cookie.Value = token
	cookie.MaxAge = int(30 * 24 * time.Hour / time.Second)

	e.SetCookie(cookie)

	return rest.RespondOK(e, nil)
}

func (s *sessionHandler) Signup(e echo.Context) error {
	u := &domain.User{}

	if err := e.Bind(u); err != nil {
		return rest.RespondMessage(
			e,
			rest.NewBadRequest(
				fmt.Sprintf("リクエストデータが不正です(%v)", err),
			),
		)
	}

	err := s.su.Signup(e.Request().Context(), u)

	var frerr rest.ErrorResponse
	if xerrors.As(err, &frerr) {
		return rest.RespondMessage(e, frerr)
	}

	if err != nil {
		return xerrors.Errorf("signup failed: %w", err)
	}

	return rest.RespondOK(e, nil)
}

func (s *sessionHandler) VerifyEmail(e echo.Context) error {
	type VerifyEmailParams struct {
		Token string `json:"token" query:"token"`
	}
	params := &VerifyEmailParams{}

	err := e.Bind(params)

	if err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest("token is missing"))
	}

	token, err := s.su.VerifyEmail(e.Request().Context(), params.Token)

	if err, ok := err.(rest.ErrorResponse); ok {
		return rest.RespondMessage(e, err)
	}

	if err != nil {
		return xerrors.Errorf("failed to verify email address: %w", err)
	}

	cookie := new(http.Cookie)

	if !insecureCookie() {
		cookie.HttpOnly = true
		cookie.Secure = true
	}

	cookie.Name = cookies.TokenCookieKey
	cookie.Value = token
	cookie.MaxAge = int(30 * 24 * time.Hour / time.Second)

	e.SetCookie(cookie)

	return rest.RespondOK(e, nil)
}
