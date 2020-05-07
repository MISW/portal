package persistence

import (
	"context"
	"database/sql"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/jmoiron/sqlx"
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
func (urp *userRolePersistence) UpdateWithRule(ctx context.Context, id, currentPeriod, paymentPeriod int) error {
	err := db.RunInTransaction(ctx, urp.db, func(ctx context.Context, db db.Ext) error {
		var role domain.RoleType
		err := db.QueryRowxContext(
			ctx,
			"SELECT role FROM users WHERE id = ?",
			id,
		).Scan(&role)

		if err != nil {
			return xerrors.Errorf("failed to get current role: %w", err)
		}

		var counter int
		err = db.QueryRowxContext(
			ctx,
			"SELECT COUNT(*) FROM payment_statuses WHERE id = ? AND period IN (?, ?)",
			id, currentPeriod, paymentPeriod,
		).Scan(&counter)

		if err != nil && err != sql.ErrNoRows {
			return xerrors.Errorf("failed to get payment statuses for current periods: %w", err)
		}

		newRole := role.GetNewRole(err != sql.ErrNoRows)

		// roleの変更がない場合は何もしない
		if role == newRole {
			return nil
		}

		_, err = db.ExecContext(
			ctx,
			"UPDATE users SET role=? WHERE id=?",
			newRole, id,
		)

		if err != nil {
			return xerrors.Errorf("failed to update role: %w", err)
		}

		return nil
	})

	if err != nil {
		return xerrors.Errorf("failed to update role with rule: %w", err)
	}

	return nil
}

// UpdateAllWithRule - ルールに基づき自動で全てのユーザのロールを変更する
func (urp *userRolePersistence) UpdateAllWithRule(ctx context.Context, currentPeriod, paymentPeriod int) error {
	query := `SELECT u.id AS id, u.role AS role, COUNT(p.period) AS count FROM users AS u LEFT JOIN payment_statuses AS p ON u.id=p.user_id AND p.period IN (?, ?) GROUP BY u.id`

	err := db.RunInTransaction(ctx, urp.db, func(ctx context.Context, db db.Ext) error {
		var users []struct {
			ID    int             `db:"id"`
			Role  domain.RoleType `db:"role"`
			Count int             `db:"count"`
		}

		if err := sqlx.SelectContext(ctx, db, &users, query, currentPeriod, paymentPeriod); err != nil {
			return xerrors.Errorf("failed to get current users: %w", err)
		}

		for i := range users {
			currentRole := users[i].Role
			newRole := currentRole.GetNewRole(users[i].Count > 0)

			if currentRole != newRole {
				db.ExecContext(ctx, "UPDATE users SET role=? WHERE id=?", newRole)
			}
		}

		return nil
	})

	if err != nil {
		return xerrors.Errorf("failed to update role with rule: %w", err)
	}

	return nil
}
