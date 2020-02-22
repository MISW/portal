package persistence

import (
	"context"
	"database/sql"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/db"
	"golang.org/x/xerrors"
)

// NewTokenPersistence - ユーザのMySQL関連の実装
func NewTokenPersistence(db db.Ext) repository.TokenRepository {
	return &tokenPersistence{db: db}
}

type token struct {
	ID        int       `db:"id"`
	UserID    int       `db:"user_id"`
	Token     string    `db:"token"`
	ExpiredAt time.Time `db:"expired_at"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

func newToken(t *domain.Token) *token {
	return &token{
		UserID:    t.UserID,
		Token:     t.Token,
		ExpiredAt: t.ExpiredAt,
		CreatedAt: t.CreatedAt,
		UpdatedAt: t.UpdatedAt,
	}
}

func parseToken(t *token) *domain.Token {
	return &domain.Token{
		UserID:    t.UserID,
		Token:     t.Token,
		ExpiredAt: t.ExpiredAt,
		CreatedAt: t.CreatedAt,
		UpdatedAt: t.UpdatedAt,
	}
}

type tokenPersistence struct {
	db db.Ext
}

var _ repository.TokenRepository = &tokenPersistence{}

// Add - 新しいトークンの追加
func (tp *tokenPersistence) Add(ctx context.Context, userID int, token string, expiredAt time.Time) error {
	_, err := tp.db.Exec(
		`INSERT INTO tokens (
			user_id,
			token,
			expired_at
		) VALUES (
			?,?,?
		)`, userID, token, expiredAt)

	if err != nil {
		return xerrors.Errorf("failed to add new token: %w", err)
	}

	return nil
}

// GetByToken - トークンを検索する
func (tp *tokenPersistence) GetByToken(ctx context.Context, tk string) (*domain.Token, error) {
	res := &token{}

	err := tp.db.QueryRowx(`
		SELECT * FROM tokens WHERE token=? AND expired_at < CURRENT_TIMESTAMP
	`, tk).StructScan(res)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, domain.ErrNoToken
		}

		return nil, xerrors.Errorf("failed to find the token: %w", err)
	}

	if res.ExpiredAt.Before(time.Now()) {
		return nil, domain.ErrNoToken
	}

	return parseToken(res), nil
}

// Delete - トークンを削除する
func (tp *tokenPersistence) Delete(ctx context.Context, token string) error {
	_, err := tp.db.Exec(`
		DELETE FROM tokens WHERE token=?
	`, token)

	if err != nil {
		return xerrors.Errorf("failed to delete the token: %w", err)
	}

	return nil
}

// DeleteAll - 特定ユーザのトークンを一生削除する
func (tp *tokenPersistence) DeleteAll(ctx context.Context, userID int) error {
	_, err := tp.db.Exec(`
		DELETE FROM tokens WHERE user_id=?
	`, userID)

	if err != nil {
		return xerrors.Errorf("failed to delete the tokens for user: %w", err)
	}

	return nil
}
