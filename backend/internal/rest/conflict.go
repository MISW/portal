package rest

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// NewConflict - Conflictを生成して返す
func NewConflict(message string) error {
	return &Conflict{
		message: message,
	}
}

// Conflict - リソースが既に存在した場合に返す
type Conflict struct {
	message string
}

var _ error = &Conflict{}
var _ ErrorResponse = &Conflict{}

func (e Conflict) Error() string {
	return e.message
}

func (e Conflict) RespondError(ctx echo.Context) error {
	return respondMessage(ctx, http.StatusConflict, e.message)
}
