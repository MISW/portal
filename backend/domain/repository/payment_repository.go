package repository

import (
	"context"
	"time"

	"github.com/MISW/Portal/backend/domain"
)

// PaymentStatusRepository - サークル費支払関連のDB操作
type PaymentStatusRepository interface {
	// Add - 新しい支払情報の追加
	Add(ctx context.Context, userID, period int, authorizer int) error

	// Get - 特定の支払い情報の取得
	Get(ctx context.Context, userID, period int) (*domain.PaymentStatus, error)

	// Delete - 支払情報を削除
	Delete(ctx context.Context, userID, period int) (bool, error)

	// GetLatestByUser - 最新の支払情報の取得
	GetLatestByUser(ctx context.Context, userID int) (*domain.PaymentStatus, error)

	// ListForPeriod returns all users paying in the period
	ListUsersForPeriod(ctx context.Context, period int) ([]*domain.PaymentStatus, error)

	// ListForUser returns all periods the user paid in
	ListPeriodsForUser(ctx context.Context, userID int) ([]*domain.PaymentStatus, error)

	// IsLatest reports the specified payment status is the latest or not.
	// CAUTION: This method doesn't check the specified status exists
	IsLatest(ctx context.Context, userID, period int) (bool, error)

	// IsFirst reports the specified payment status is the first or not.
	// CAUTION: This method doesn't check the specified status exists
	IsFirst(ctx context.Context, userID, period int) (bool, error)

	// HasMatchingPeriod returns whether there is a payment status matching parameters
	HasMatchingPeriod(ctx context.Context, userID int, periods []int) (bool, error)

	// ListUnpaidMembers returns all unpaid members for the specified period
	ListUnpaidMembers(ctx context.Context, paymentPeriod int) ([]*domain.User, error)
}

// PaymentTransactionRepository - サークル費支払い時のトークン管理
type PaymentTransactionRepository interface {
	// Add - 新しい支払情報の追加
	Add(ctx context.Context, userID int, token string, expiredAt time.Time) error

	Get(ctx context.Context, token string) (*domain.PaymentTransaction, error)

	Delete(ctx context.Context, token string) error

	RevokeExpired(ctx context.Context) error
}
