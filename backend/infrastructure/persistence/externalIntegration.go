package persistence

import (
	"database/sql"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/jmoiron/sqlx"
	"golang.org/x/xerrors"
)

// NewExternalIntegrationPersistence - 外部連携サービスのためのDB
func NewExternalIntegrationPersistence(db db.Ext) repository.ExternalIntegrationRepository {
	return &externalIntegrationPersistence{db: db}
}

type externalIntegrationPersistence struct {
	db db.Ext
}

var _ repository.ExternalIntegrationRepository = &externalIntegrationPersistence{}

// GetUserRole finds a user by slack id and returns his/her role
func (p *externalIntegrationPersistence) GetUserRoleFromSlackID(slackID string) (string, error) {
	var role string
	err := sqlx.Get(
		p.db, &role,
		"SELECT role FROM users WHERE slack_id = ?", slackID,
	)

	if err == sql.ErrNoRows {
		return "", domain.ErrNoUser
	}

	if err != nil {
		return "", xerrors.Errorf("failed to find user from slack id: %w", err)
	}

	return role, nil
}
