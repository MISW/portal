package repository

import (
	"github.com/MISW/Portal/backend/internal/db"
)

// UserRepository - User関連のDB操作
type UserRepository interface {
	Insert(DB db.Ext, *domain.User) (int, error)
	GetByID(DB db.Ext, id int) (*domain.User, error)
	GetBySlackID(DB db.Ext, slackID string) (*domain.User, error)
	GetByEmail(DB db.Ext, slackID string) (*domain.User, error)
	List(DB db.Ext) ([]*domain.User, error)
}
