package fronterrors

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// NewForbidden - Forbiddenを生成して返す
func NewForbidden(message string) error {
	return &Forbidden{
		message: message,
	}
}

// Forbidden - ユーザが認証されていない時に返す
type Forbidden struct {
	message string
}

var _ error = &Forbidden{}
var _ ErrorResponse = &BadRequest{}

func (e Forbidden) Error() string {
	return e.message
}

func (e Forbidden) RespondError(ctx echo.Context) error {
	return respondMessage(ctx, http.StatusForbidden, e.message)
}
