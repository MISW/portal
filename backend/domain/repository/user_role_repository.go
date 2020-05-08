package repository

import (
	context "context"

	"github.com/MISW/Portal/backend/domain"
)

//go:generate mockgen -source=$GOFILE -destination=mock_$GOFILE -package=$GOPACKAGE

// UserRoleRepository - Userの権限関連のDB操作
type UserRoleRepository interface {
	// Update - 手動でroleを切り替え
	Update(ctx context.Context, id int, role domain.RoleType) error

	// UpdateWithRule - ルールに基づき自動でユーザのロールを変更する
	UpdateWithRule(ctx context.Context, id, currentPeriod, paymentPeriod int) error

	// UpdateAllWithRule - ルールに基づき自動で全てのユーザのロールを変更する
	UpdateAllWithRule(ctx context.Context, currentPeriod, paymentPeriod int) error
}
