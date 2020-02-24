package rest

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

// RespondOK - 正常終了した際の結果を返す
func RespondOK(ctx echo.Context, json map[string]interface{}) error {
	if json == nil {
		json = map[string]interface{}{}
	}
	code := http.StatusOK

	json["status"] = http.StatusText(code)
	json["status_code"] = code

	return ctx.JSON(code, json)
}

func respondMessage(e echo.Context, code int, message string) error {
	return e.JSON(code, map[string]interface{}{
		"status_code": code,
		"status":      http.StatusText(code),
		"message":     message,
	})
}
