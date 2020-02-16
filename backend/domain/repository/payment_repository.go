package repository

import (
	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/internal/db"
)

// PaymentStatusRepository - サークル費支払関連のDB操作
type PaymentStatusRepository interface {
	// Add - 新しい支払情報の追加
	Add(db db.Ext, userID, period int, authorizer int) error

	// GetLatestByUser - 最新の支払情報の取得
	GetLatestByUser(db db.Ext, userID int) (*domain.PaymentStatus, error)

	// ListForPeriod returns all users paying in the period
	ListUsersForPeriod(db db.Ext, period int) ([]*domain.PaymentStatus, error)

	// ListForUser returns all periods the user paid in
	ListPeriodsForUser(db db.Ext, userID int) ([]*domain.PaymentStatus, error)
}
