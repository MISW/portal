package persistence

import (
	"context"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/db"
	"golang.org/x/xerrors"
)

// NewUserRolePersistence -
func NewUserRolePersistence(db db.Ext) repository.UserRoleRepository {
	return &userRolePersistence{db: db}
}

type userRolePersistence struct {
	db db.Ext
}

var _ repository.UserRoleRepository = &userRolePersistence{}

// Update - 手動でroleを切り替え
func (urp *userRolePersistence) Update(ctx context.Context, id int, role domain.RoleType) error {
	_, err := urp.db.Exec(`
	UPDATE users SET
		role=?
	WHERE id=?
	`, string(role), id)

	if err != nil {
		return xerrors.Errorf("failed to update user(%d): %w", id, err)
	}

	return nil
}

// UpdateWithRule - ルールに基づき自動でユーザのロールを変更する
func (urp *userRolePersistence) UpdateWithRule(ctx context.Context, id int) error {
	panic("not implemented")
}

// UpdateAllWithRule - ルールに基づき自動で全てのユーザのロールを変更する
func (urp *userRolePersistence) UpdateAllWithRule(ctx context.Context) error {
	panic("not implemented")
}
