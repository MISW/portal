package private

import (
	"fmt"

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

	// AddPaymentStatus - 支払い情報を追加(QRコード経由せず)
	AddPaymentStatus(e echo.Context) error

	// GetPaymentStatus - 特定の支払い情報を取得する
	GetPaymentStatus(e echo.Context) error

	// DeletePaymentStatus - 支払い情報を追加(QRコード経由せず)
	DeletePaymentStatus(e echo.Context) error

	// GetPaymentStatuses - 支払い情報一覧を取得する
	GetPaymentStatuses(e echo.Context) error

	// GetUser - ユーザ情報を取得
	GetUser(e echo.Context) error

	// UpdateUser - ユーザ情報を更新(制限なし)
	UpdateUser(e echo.Context) error

	// UpdateRole - ユーザのroleを変更
	UpdateRole(e echo.Context) error

	// InviteToSlack - Slackに招待されていないメンバーをSlackに招待する(非同期)
	InviteToSlack(e echo.Context) error
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

	return rest.RespondOK(
		e,
		map[string]interface{}{
			"users": users,
		},
	)
}

// AuthorizeTransaction - 支払い申請を許可する
func (mh *managementHandler) AuthorizeTransaction(e echo.Context) error {
	user := e.Get(middleware.UserKey).(*domain.User)

	var param struct {
		Token string `json:"token" query:"token"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest(fmt.Sprintf("token is missing: %v", err)))
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

// AddPaymentStatus - 支払い情報を追加(QRコード経由せず)
func (mh *managementHandler) AddPaymentStatus(e echo.Context) error {
	user := e.Get(middleware.UserKey).(*domain.User)

	var param struct {
		UserID int `json:"user_id" query:"user_id"`
		Period int `json:"period" query:"period"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest(fmt.Sprintf("invalid request values: %v", err)))
	}

	err := mh.mu.AddPaymentStatus(e.Request().Context(), param.UserID, param.Period, user.ID)

	var frerr rest.ErrorResponse
	if xerrors.As(err, &frerr) {
		return rest.RespondMessage(e, frerr)
	}

	if err != nil {
		return xerrors.Errorf("failed to add payment status: %w", err)
	}

	return rest.RespondOK(e, nil)
}

// GetPaymentStatus - 特定の支払い情報を取得する
func (mh *managementHandler) GetPaymentStatus(e echo.Context) error {
	var param struct {
		UserID int `json:"user_id" query:"user_id"`
		Period int `json:"period" query:"period"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest(fmt.Sprintf("invalid request values: %v", err)))
	}

	ps, err := mh.mu.GetPaymentStatus(e.Request().Context(), param.UserID, param.Period)

	var frerr rest.ErrorResponse
	if xerrors.As(err, &frerr) {
		return rest.RespondMessage(e, frerr)
	}

	if err != nil {
		return xerrors.Errorf("failed to get payment status(user_id: %d, period: %d): %w", param.UserID, param.Period, err)
	}

	return rest.RespondOK(e, map[string]interface{}{
		"payment_status": ps,
	})
}

// DeletePaymentStatus - 支払い情報を追加(QRコード経由せず)
func (mh *managementHandler) DeletePaymentStatus(e echo.Context) error {
	var param struct {
		UserID int `json:"user_id" query:"user_id"`
		Period int `json:"period" query:"period"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest(fmt.Sprintf("invalid request values: %v", err)))
	}

	err := mh.mu.DeletePaymentStatus(e.Request().Context(), param.UserID, param.Period)

	if err != nil {
		return xerrors.Errorf("failed to delete payment status due to internal server error: %w", err)
	}

	return rest.RespondOK(e, nil)
}

// GetPaymentStatusesForUser - あるユーザの支払い情報一覧を取得する
func (mh *managementHandler) GetPaymentStatuses(e echo.Context) error {
	var param struct {
		UserID *int `json:"user_id" query:"user_id"`
		Period *int `json:"period" query:"period"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest(fmt.Sprintf("invalid request values: %v", err)))
	}

	var res []*domain.PaymentStatus

	ctx := e.Request().Context()

	switch {
	case param.UserID != nil && param.Period != nil:
		ps, err := mh.mu.GetPaymentStatus(ctx, *param.UserID, *param.Period)

		var nf *rest.NotFound
		if err != nil && !xerrors.As(err, &nf) {
			return xerrors.Errorf("failed to get payment status(user_id: %d, period: %d)", *param.UserID, *param.Period, err)
		}

		if ps != nil {
			res = append(res, ps)
		}

	case param.UserID != nil:
		var err error
		res, err = mh.mu.GetPaymentStatusesForUser(ctx, *param.UserID)

		if err != nil {
			return xerrors.Errorf("failed to list payment statuses for user(%d) due to internal server error: %w", err)
		}
	case param.Period != nil:
		return rest.NewBadRequest("特定のperiodに対する支払い情報一覧を取得する機能は未実装です")
	default:
		return rest.NewBadRequest("全支払い情報を一括で取得する機能は提供されていません")
	}

	return rest.RespondOK(e, map[string]interface{}{
		"payment_statuses": res,
	})
}

// GetUser - ユーザ情報を取得
func (mh *managementHandler) GetUser(e echo.Context) error {
	var param struct {
		UserID int `json:"user_id" query:"user_id"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest(fmt.Sprintf("invalid request values: %v", err)))
	}

	user, err := mh.mu.GetUser(e.Request().Context(), param.UserID)

	var frerr rest.ErrorResponse
	if xerrors.As(err, &frerr) {
		return rest.RespondMessage(e, frerr)
	}

	if err != nil {
		return xerrors.Errorf("failed to get user(%d): %w", param.UserID, err)
	}

	return rest.RespondOK(e, map[string]interface{}{
		"user": user,
	})
}

// UpdateUser - ユーザ情報を更新(制限なし)
func (mh *managementHandler) UpdateUser(e echo.Context) error {
	var param struct {
		User *domain.User `json:"user"`
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest(fmt.Sprintf("invalid request values: %v", err)))
	}

	if param.User == nil {
		return rest.RespondMessage(e, rest.NewBadRequest("invalid request values"))
	}

	err := mh.mu.UpdateUser(e.Request().Context(), param.User)

	var frerr rest.ErrorResponse
	if xerrors.As(err, &frerr) {
		return rest.RespondMessage(e, err)
	}

	if err != nil {
		return xerrors.Errorf("failed to get user(%d): %w", param.User.ID, err)
	}

	return rest.RespondOK(e, nil)
}

// UpdateRole - ユーザのroleを変更
func (mh *managementHandler) UpdateRole(e echo.Context) error {
	var param struct {
		UserID int `json:"user_id"`
		Role   domain.RoleType
	}

	if err := e.Bind(&param); err != nil {
		return rest.RespondMessage(e, rest.NewBadRequest(fmt.Sprintf("invalid request values: %v", err)))
	}

	if err := mh.mu.UpdateRole(e.Request().Context(), param.UserID, param.Role); err != nil {
		return xerrors.Errorf("failed to update role(%d): %w", param.UserID, err)
	}

	return rest.RespondOK(e, nil)
}

// InviteToSlack - Slackに招待されていないメンバーをSlackに招待する(非同期)
func (mh *managementHandler) InviteToSlack(e echo.Context) error {
	if err := mh.mu.InviteToSlack(e.Request().Context()); err != nil {
		return xerrors.Errorf("failed to invite to slack: %w", err)
	}

	return rest.RespondOK(e, nil)
}
