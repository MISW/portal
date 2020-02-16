package repository

import (
	"context"
	"time"

	"github.com/MISW/Portal/backend/domain"
)

// TokenRepository - 認証用トークンのDB操作
type TokenRepository interface {
	// Add - 新しいトークンの追加
	Add(ctx context.Context, userID int, token string, expiredAt time.Time) error

	// GetByToken - トークンを検索する
	GetByToken(ctx context.Context, token string) (*domain.Token, error)

	// Delete - トークンを削除する
	Delete(ctx context.Context, token string) error

	// DeleteAll - 特定ユーザのトークンを一生削除する
	DeleteAll(ctx context.Context, userID int) error
}
