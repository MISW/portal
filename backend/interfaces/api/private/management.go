package private

import (
	"net/http"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/internal/middleware"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
	"golang.org/x/xerrors"
)

// ManagementHandler - セッション周りの非公開API
type ManagementHandler interface {
	// ListUsers - ユーザ一覧を返す
	ListUsers(e echo.Context) error

	// AuthorizeTransaction - 支払い申請を許可する
	AuthorizeTransaction(e echo.Context) error
}

// NewManagementHandler - ManagementHandlerを初期化
func NewManagementHandler(mu usecase.ManagementUsecase) ManagementHandler {
	return &managementHandler{
		mu: mu,
	}
}

var _ ManagementHandler = &managementHandler{}

type managementHandler struct {
	mu usecase.ManagementUsecase
}

// ListUsers - ユーザ一覧を返す
func (mh *managementHandler) ListUsers(e echo.Context) error {
	var query struct {
		Period int `query:"period"`
	}

	if err := e.Bind(&query); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest("invalid period"))
	}

	users, err := mh.mu.ListUsers(e.Request().Context(), query.Period)

	var frerr rest.ErrorResponse
	if xerrors.As(err, &frerr) {
		return rest.RespondMessage(e, frerr)
	}

	if err != nil {
		return xerrors.Errorf("failed to list users: %w", err)
	}

	return e.JSON(http.StatusOK, users)
}

// AuthorizeTransaction - 支払い申請を許可する
func (mh *managementHandler) AuthorizeTransaction(e echo.Context) error {
	user := e.Get(middleware.UserKey).(*domain.User)

	var param struct {
		Token string `json:"token" query:"token"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest("token is missing"))
	}

	err := mh.mu.AuthorizeTransaction(e.Request().Context(), param.Token, user.ID)

	var frerr rest.ErrorResponse
	if xerrors.As(err, &frerr) {
		return rest.RespondMessage(e, frerr)
	}

	if err != nil {
		return xerrors.Errorf("failed to authorize transaction: %w", err)
	}

	return rest.RespondOK(e, nil)
}
