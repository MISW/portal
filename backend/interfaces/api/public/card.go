package public

import (
	"fmt"
	"strconv"

	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
)

// CardHandler - 会員証周りの公開API
type CardHandler interface {
	// Get - 会員証のための情報を取得する
	Get(e echo.Context, id string) error
}

// NewCardHandler - CardHandlerを初期化
func NewCardHandler(cu usecase.CardUsecase) CardHandler {
	return &cardHandler{
		cu: cu,
	}
}

type cardHandler struct {
	cu usecase.CardUsecase
}

func (ch *cardHandler) Get(e echo.Context, id string) error {
	userId, err := strconv.Atoi(id)

	if err != nil {
		return rest.RespondMessage(
			e, rest.NewBadRequest(
				fmt.Sprintf("expect int value, but got \"%s\"", id),
			),
		)
	}

	card, err := ch.cu.Get(e.Request().Context(), userId)

	if err != nil {
		// 公開・非公開、ユーザーの存在について一切の情報を返さない
		return rest.RespondMessage(
			e, rest.NewNotFound(
				fmt.Sprintf("card not found for user(%d)", userId),
			),
		)
	}

	return rest.RespondOKAny(e, card)
}
