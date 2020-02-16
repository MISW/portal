package repository

import (
	"context"

	"github.com/MISW/Portal/backend/domain"
)

// PaymentStatusRepository - サークル費支払関連のDB操作
type PaymentStatusRepository interface {
	// Add - 新しい支払情報の追加
	Add(ctx context.Context, userID, period int, authorizer int) error

	// GetLatestByUser - 最新の支払情報の取得
	GetLatestByUser(ctx context.Context, userID int) (*domain.PaymentStatus, error)

	// ListForPeriod returns all users paying in the period
	ListUsersForPeriod(ctx context.Context, period int) ([]*domain.PaymentStatus, error)

	// ListForUser returns all periods the user paid in
	ListPeriodsForUser(ctx context.Context, userID int) ([]*domain.PaymentStatus, error)
}
