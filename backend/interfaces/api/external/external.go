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

func (h *ExternalHandler) GetUserRoleFromSlackID(e echo.Context) error {
	var param struct {
		slackID string `query:"slack_id"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest("invalid slack_id"))
	}

	role, err := h.eu.GetUserRoleFromSlackID(param.slackID)

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
