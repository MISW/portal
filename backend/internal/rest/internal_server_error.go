package rest

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// NewInternalServerError - InternalServerErrorを生成して返す
func NewInternalServerError(message string) error {
	return &InternalServerError{
		message: message,
	}
}

// InternalServerError - サーバ内部でエラーが発生
type InternalServerError struct {
	message string
}

var _ error = &InternalServerError{}
var _ ErrorResponse = &InternalServerError{}

func (e InternalServerError) Error() string {
	return e.message
}

func (e InternalServerError) RespondError(ctx echo.Context) error {
	return respondMessage(ctx, http.StatusInternalServerError, e.message)
}
