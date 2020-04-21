package rest

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// NewNotFound - NotFoundを生成して返す
func NewNotFound(message string) error {
	return &NotFound{
		message: message,
	}
}

// NotFound - ユーザの入力値が不正だった場合に返す
type NotFound struct {
	message string
}

var _ error = &NotFound{}
var _ ErrorResponse = &NotFound{}

func (e NotFound) Error() string {
	return e.message
}

func (e NotFound) RespondError(ctx echo.Context) error {
	return respondMessage(ctx, http.StatusNotFound, e.message)
}
