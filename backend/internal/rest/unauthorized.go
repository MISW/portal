package rest

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// NewUnauthorized - Unauthorizedを生成して返す
func NewUnauthorized(message string) error {
	return &Unauthorized{
		message: message,
	}
}

// Unauthorized - ユーザが認証されていない時に返す
type Unauthorized struct {
	message string
}

var _ error = &Unauthorized{}
var _ ErrorResponse = &Unauthorized{}

func (e Unauthorized) Error() string {
	return e.message
}

func (e Unauthorized) RespondError(ctx echo.Context) error {
	return respondMessage(ctx, http.StatusUnauthorized, e.message)
}
