package repository

import (
	"context"

	"github.com/MISW/Portal/backend/domain"
)

// AccountInfoRepository - ソーシャルログインに用いるアカウント情報関連の操作
type AccountInfoRepository interface {
	// Save - アカウント情報の保存
	Save(ctx context.Context, account *domain.AccountInfo) error

	// GetByToken - Tokenで検索・取得
	GetByToken(ctx context.Context, token string) (*domain.AccountInfo, error)
}
