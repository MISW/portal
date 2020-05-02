package persistence

import (
	"context"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/go-sql-driver/mysql"
	"golang.org/x/xerrors"
)

type slackPersistence struct {
	db db.Ext
}

// NewSlackPersistence - SlackRepository関連の処理を行うrepositoryを初期化
func NewSlackPersistence(db db.Ext) repository.SlackRepository {
	return &slackPersistence{db: db}
}

// UpdateSlackID - ユーザのSlack IDを更新する
func (sp *slackPersistence) UpdateSlackID(ctx context.Context, id int, slackID string) error {
	var sid *string

	if len(slackID) != 0 {
		sid = &slackID
	}

	_, err := sp.db.Exec(`
	UPDATE users SET
		slack_id=?
	WHERE id=?
	`, sid, id)

	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return domain.ErrSlackIDConflicts
		}

		return xerrors.Errorf("failed to update user(%d): %w", id, err)
	}

	return nil
}

// MarkUninvitedAsPending - Slackに招待されていないユーザをSlackに招待する
func (sp *slackPersistence) MarkUninvitedAsPending(ctx context.Context) error {
	_, err := sp.db.Exec(`
	UPDATE users SET
		slack_invitation_status="pending"
	WHERE (role="member" OR role="admin") AND slack_id IS NULL AND slack_invitation_status="never"
	`)

	if err != nil {
		return xerrors.Errorf("failed to update user: %w", err)
	}

	return nil
}
