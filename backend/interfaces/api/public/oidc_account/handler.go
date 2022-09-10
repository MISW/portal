package oidc_account

import (
	"errors"
	"fmt"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/internal/middleware"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
)

// Handler - アカウントは持っていないがOIDCでログインはできるユーザが取り扱える
type Handler interface {
	Signup(e echo.Context) error
	Get(e echo.Context) error
}

type oidcHandler struct {
	su usecase.SessionUsecase
}

// NewOIDCHandler - アカウントは持っていないがOIDCでログインはできるユーザが取り扱える
func NewOIDCHandler(su usecase.SessionUsecase) Handler {
	return &oidcHandler{
		su: su,
	}
}

func (s *oidcHandler) Signup(e echo.Context) error {
	accountInfo, ok := e.Get(middleware.OIDCAccountInfoKey).(*domain.OIDCAccountInfo)
	if !ok {
		return rest.NewInternalServerError("failed to get oidc account info")
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

	err := s.su.Signup(e.Request().Context(), u, accountInfo)
	var frerr rest.ErrorResponse
	if errors.As(err, &frerr) {
		return rest.RespondMessage(e, frerr)
	}
	if err != nil {
		return fmt.Errorf("signup failed: %w", err)
	}

	return rest.RespondOK(e, nil)
}

func (h *oidcHandler) Get(e echo.Context) error {
	accountInfo, ok := e.Get(middleware.OIDCAccountInfoKey).(*domain.OIDCAccountInfo)
	if !ok {
		return rest.NewInternalServerError("failed to get oidc account info")
	}

	return rest.RespondOK(e,
		map[string]interface{}{
			"info": *accountInfo,
		},
	)
}
