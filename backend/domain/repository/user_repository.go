package repository

import (
	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/internal/db"
)

// UserRepository - User関連のDB操作
type UserRepository interface {
	// Insert - 新規サークル員の追加
	Insert(db db.Ext, user *domain.User) (int, error)

	// GetByID - IDで検索
	GetByID(db db.Ext, id int) (*domain.User, error)

	// GetByID - Slack IDで検索
	GetBySlackID(db db.Ext, slackID string) (*domain.User, error)

	// GetByEmail - Emailで検索
	GetByEmail(db db.Ext, email string) (*domain.User, error)

	// List - 全ユーザを取得
	List(db db.Ext) ([]*domain.User, error)

	// ListByID - ユーザIDが一致する全てのユーザを取得
	ListByID(db db.Ext, ids []int) ([]*domain.User, error)
}
