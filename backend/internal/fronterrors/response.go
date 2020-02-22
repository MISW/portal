package fronterrors

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// ErrorResponse - エラーメッセージをJSONとして返却するインターフェース
type ErrorResponse interface {
	RespondError(e echo.Context) error

	error
}

// RespondMessage - ステータスコードに紐づけられたエラーであればechoのresponseを返す
func RespondMessage(ctx echo.Context, err error) error {
	e, ok := err.(ErrorResponse)

	if !ok {
		return nil
	}

	return e.RespondError(ctx)
}

func respondMessage(e echo.Context, code int, message string) error {
	return e.JSON(code, map[string]string{
		"status":  http.StatusText(code),
		"message": message,
	})
}
