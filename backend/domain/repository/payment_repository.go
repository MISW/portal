package repository

import (
	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/internal/db"
)

// PaymentStatusRepository - サークル費支払関連のDB操作
type PaymentStatusRepository interface {
	// Insert - 新しい支払情報の追加
	Insert(DB db.Ext, userID, authorizer int, period int) (*domain.PaymentStatus, error)

	// GetLastByUser - 最新の支払情報の取得
	GetLastByUser(DB db.Ext, userID int) (int, error)

	// ListForPeriod returns all users paying in the period
	ListUsersForPeriod(DB db.Ext, period int) ([]int, error)

	// ListForUser returns all periods the user paid in
	ListPeriodsForUser(DB db.Ext, userID int) ([]int, error)
}
