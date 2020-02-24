package rest

import (
	"encoding/json"
	"net/http"

	"github.com/labstack/echo/v4"
	"golang.org/x/xerrors"
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

// RespondOKAny - 正常終了した際の結果を返す(struct用)
func RespondOKAny(ctx echo.Context, j interface{}) error {
	b, err := json.Marshal(j)

	if err != nil {
		return xerrors.Errorf("failed to encode to json: %w", err)
	}

	var m map[string]interface{}
	err = json.Unmarshal(b, &m)

	if err != nil {
		return xerrors.Errorf("failed to decode json: %w", err)
	}

	return RespondOK(ctx, m)
}

func respondMessage(e echo.Context, code int, message string) error {
	return e.JSON(code, map[string]interface{}{
		"status_code": code,
		"status":      http.StatusText(code),
		"message":     message,
	})
}
