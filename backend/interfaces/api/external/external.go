package external

import (
	"net/http"

	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
	"golang.org/x/xerrors"
)

func NewExternalHandler(eu usecase.ExternalIntegrationUsecase) *ExternalHandler {
	return &ExternalHandler{
		eu: eu,
	}
}

type ExternalHandler struct {
	eu usecase.ExternalIntegrationUsecase
}

func (h *ExternalHandler) GetUserRoleFromAccountID(e echo.Context) error {
	var param struct {
		AccountID string `query:"account_id"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest("invalid account_id"))
	}

	role, err := h.eu.GetUserRoleFromAccountID(param.AccountID)

	var frerr rest.ErrorResponse
	if xerrors.As(err, &frerr) {
		return rest.RespondMessage(e, frerr)
	}

	if err != nil {
		return xerrors.Errorf("failed to retrieve the user's role: %w", err)
	}

	return e.JSON(http.StatusOK, map[string]string{
		"role": role,
	})
}

func (h *ExternalHandler) GetAllMemberRolesByAccountID(e echo.Context) error {
	roles, err := h.eu.GetAllMemberRolesByAccountID(e.Request().Context())

	if err != nil {
		return xerrors.Errorf("failed to retrieve users' roles: %w", err)
	}

	type ResponseItem struct {
		Role string `json:"role"`
	}

	res := map[string]ResponseItem{}

	for id, role := range roles {
		res[id] = ResponseItem{
			Role: role,
		}
	}

	return e.JSON(http.StatusOK, res)
}
