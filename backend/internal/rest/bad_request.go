package rest

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// NewBadRequest - BadRequestを生成して返す
func NewBadRequest(message string) error {
	return &BadRequest{
		message: message,
	}
}

// BadRequest - ユーザの入力値が不正だった場合に返す
type BadRequest struct {
	message string
}

var _ error = &BadRequest{}
var _ ErrorResponse = &BadRequest{}

func (e BadRequest) Error() string {
	return e.message
}

func (e BadRequest) RespondError(ctx echo.Context) error {
	return respondMessage(ctx, http.StatusBadRequest, e.message)
}
