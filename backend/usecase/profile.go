package usecase

import (
	"context"

	"github.com/MISW/Portal/backend/domain"
)

// ProfileUsecase - プロフィール関連の処理
type ProfileUsecase interface {
	Get(ctx context.Context, userID int) (*domain.User, error)
	Update(ctx context.Context, userID int) (*domain.User, error)

	GetPaymentStatuses(ctx context.Context, userID int) ([]*domain.PaymentStatus, error)
}
