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

	// Delete - 支払情報を削除
	Delete(ctx context.Context, userID, period int) error

	// GetLatestByUser - 最新の支払情報の取得
	GetLatestByUser(ctx context.Context, userID int) (*domain.PaymentStatus, error)

	// ListForPeriod returns all users paying in the period
	ListUsersForPeriod(ctx context.Context, period int) ([]*domain.PaymentStatus, error)

	// ListForUser returns all periods the user paid in
	ListPeriodsForUser(ctx context.Context, userID int) ([]*domain.PaymentStatus, error)
}

// PaymentTransactionRepository - サークル費支払い時のトークン管理
type PaymentTransactionRepository interface {
	// Add - 新しい支払情報の追加
	Add(ctx context.Context, userID int, token string, expiredAt time.Time) error

	Get(ctx context.Context, token string) (*domain.PaymentTransaction, error)

	Delete(ctx context.Context, token string) error

	RevokeExpired(ctx context.Context) error
}
