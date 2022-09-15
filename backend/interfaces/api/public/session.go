package public

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/MISW/Portal/backend/internal/cookies"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
	"golang.org/x/xerrors"
)

// SessionHandler - セッション周りの非公開API
type SessionHandler interface {
	Login(e echo.Context) error

	Logout(e echo.Context) error

	Callback(e echo.Context) error

	VerifyEmail(e echo.Context) error
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

func newCookie(key, value string, age time.Duration) *http.Cookie {
	cookie := new(http.Cookie)

	if !insecureCookie() {
		cookie.HttpOnly = true
		cookie.Secure = true
		cookie.SameSite = http.SameSiteLaxMode
	}

	cookie.Name = key
	cookie.Value = value
	cookie.MaxAge = int(age / time.Second)
	cookie.Path = "/"

	return cookie
}

func (s *sessionHandler) Login(e echo.Context) error {
	redirectURL, state, err := s.su.Login(e.Request().Context())

	if err != nil {
		return xerrors.Errorf("failed to generate redirect url for OpenID Connect: %w", err)
	}

	cookie := newCookie(
		cookies.StateCookieKey,
		state,
		300*time.Second,
	)

	e.SetCookie(cookie)

	return rest.RespondOK(
		e,
		map[string]interface{}{
			"redirect_url": redirectURL,
		},
	)
}

// Logout - OIDC account からログインするURLを返す. 認証に失敗したユーザが別アカウントでログインするために必要.
func (s *sessionHandler) Logout(e echo.Context) error {
	//cookieにtokenが会ったらそれを使う
	token := ""
	ck, err := e.Cookie(cookies.TokenCookieKey)
	if err == nil {
		token = ck.Value
	}

	logoutURL, err := s.su.LogoutFromOIDC(e.Request().Context(), token)
	if err != nil {
		return xerrors.Errorf("failed to generate logout url for OpenID Connect: %w", err)
	}

	return rest.RespondOK(
		e,
		map[string]interface{}{
			"logout_url": logoutURL,
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

	token, hasAccount, err := s.su.Callback(e.Request().Context(), expectedState, oauth2Param.State, oauth2Param.Code)

	if err != nil {
		e.Logger().Infof("failed to validate token: %+v", err)

		return rest.RespondMessage(
			e,
			rest.NewBadRequest("failed to validate token"),
		)
	}

	cookie = newCookie(
		cookies.TokenCookieKey,
		token,
		30*24*time.Hour,
	)

	e.SetCookie(cookie)

	return rest.RespondOK(e, map[string]interface{}{
		"has_account": hasAccount,
	})
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

	cookie := newCookie(
		cookies.TokenCookieKey,
		token,
		30*24*time.Hour,
	)

	e.SetCookie(cookie)

	return rest.RespondOK(e, nil)
}
