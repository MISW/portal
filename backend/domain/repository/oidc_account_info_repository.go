package repository

import (
	"context"

	"github.com/MISW/Portal/backend/domain"
)

// OIDCAccountInfoRepository - ソーシャルログインに用いるアカウント情報関連の操作
// DBに未登録のユーザーがログインした際にここに情報を保存する
// ユーザーがSignupする際にここに保存した情報を使用する
type OIDCAccountInfoRepository interface {
	// Save - アカウント情報の保存
	Save(ctx context.Context, account *domain.OIDCAccountInfo) error

	// GetByToken - Tokenで検索・取得
	GetByToken(ctx context.Context, token string) (*domain.OIDCAccountInfo, error)

	// Delete - 削除
	Delete(ctx context.Context, token string) error
}
