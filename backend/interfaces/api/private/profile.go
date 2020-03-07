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

// ProfileHandler - セッション周りの非公開API
type ProfileHandler interface {
	// Get - 自分自身のプロフィール情報を取得する
	Get(e echo.Context) error
	// Update - 自分自身のプロフィール情報を更新する
	Update(e echo.Context) error

	// GetPaymentStatuses - 自分自身の支払い状況を取得する
	GetPaymentStatuses(e echo.Context) error

	// GetPaymentTransaction - 支払い用トークンを生成する
	GetPaymentTransaction(e echo.Context) error
}

// NewProfileHandler - ProfileHandlerを初期化
func NewProfileHandler(su usecase.ProfileUsecase) ProfileHandler {
	return &profileHandler{
		su: su,
	}
}

var _ ProfileHandler = &profileHandler{}

type profileHandler struct {
	su usecase.ProfileUsecase
}

// Get - 自分自身のプロフィール情報を取得する
func (ph *profileHandler) Get(e echo.Context) error {
	user := e.Get(middleware.UserKey).(*domain.User)

	return rest.RespondOKAny(e, user)
}

// Update - 自分自身のプロフィール情報を更新する
func (ph *profileHandler) Update(e echo.Context) error {
	registeredUser := e.Get(middleware.UserKey).(*domain.User)

	user := &domain.User{}
	if err := e.Bind(user); err != nil {
		return rest.RespondMessage(
			e,
			rest.NewBadRequest(
				fmt.Sprintf("リクエストデータが不正です(%v)", err),
			),
		)
	}

	user, err := ph.su.Update(e.Request().Context(), registeredUser, user)

	if err != nil {
		return xerrors.Errorf("failed to update user: %w", err)
	}

	return rest.RespondOKAny(e, user)
}

// GetPaymentStatuses - 自分自身の支払い状況を取得する
func (ph *profileHandler) GetPaymentStatuses(e echo.Context) error {
	user := e.Get(middleware.UserKey).(*domain.User)

	ps, err := ph.su.GetPaymentStatuses(e.Request().Context(), user.ID)

	if err != nil {
		return xerrors.Errorf("failed to get payment statuses: %w", err)
	}

	return rest.RespondOKAny(
		e,
		map[string]interface{}{
			"payment_statuses": ps,
		},
	)
}

// GetPaymentTransaction - 支払い用トークンを生成する
func (ph *profileHandler) GetPaymentTransaction(e echo.Context) error {
	user := e.Get(middleware.UserKey).(*domain.User)

	pt, err := ph.su.GetPaymentTransaction(e.Request().Context(), user.ID)

	if err != nil {
		return xerrors.Errorf("failed to generate payment transaction: %w", err)
	}

	return rest.RespondOKAny(
		e,
		map[string]interface{}{
			"token":      pt.Token,
			"expired_at": pt.ExpiredAt,
		},
	)
}
