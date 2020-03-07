package persistence

import (
	"context"
	"database/sql"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/jmoiron/sqlx"
	"golang.org/x/xerrors"
)

// NewPaymentTransactionPersistence - 支払状況のMySQL関連の実装
func NewPaymentTransactionPersistence(db db.Ext) repository.PaymentTransactionRepository {
	return &paymentTransactionPersistence{db: db}
}

type paymentTransaction struct {
	ID     int    `db:"id"`
	Token  string `db:"token"`
	UserID int    `db:"user_id"`

	ExpiredAt time.Time `db:"expired_at"`
	CreatedAt time.Time `db:"created_at"`
}

type paymentTransactionPersistence struct {
	db db.Ext
}

var _ repository.PaymentTransactionRepository = &paymentTransactionPersistence{}

func (ptp paymentTransactionPersistence) Add(ctx context.Context, userID int, token string, expiredAt time.Time) error {
	query := `INSERT INTO payment_transactions (
	user_id,
	token,
	expired_at
) VALUES (
	:user_id,
	:token,
	:expired_at
)
`

	_, err := sqlx.NamedExec(ptp.db, query, &paymentTransaction{
		Token:     token,
		UserID:    userID,
		ExpiredAt: expiredAt,
	})

	if err != nil {
		return xerrors.Errorf("failed to add new payment transaction: %w", err)
	}

	return nil
}

func (ptp paymentTransactionPersistence) Get(ctx context.Context, token string) (*domain.PaymentTransaction, error) {
	query := `
	SELECT * FROM payment_transactions WHERE token=? AND expired_at > CURRENT_TIMESTAMP
`

	pt := &paymentTransaction{}
	err := sqlx.Get(ptp.db, pt, query, token)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, domain.ErrNoPaymentTransaction
		}

		return nil, xerrors.Errorf("failed to find payment transaction: %w", err)
	}

	res := &domain.PaymentTransaction{
		Token:     pt.Token,
		UserID:    pt.UserID,
		CreatedAt: pt.CreatedAt,
		ExpiredAt: pt.ExpiredAt,
	}

	return res, nil
}

func (ptp paymentTransactionPersistence) Delete(ctx context.Context, token string) error {
	query := `DELETE FROM payment_transactions WHERE token=?`

	_, err := ptp.db.Exec(query, token)

	if err != nil {
		return xerrors.Errorf("failed to delete payment transaction: %w", err)
	}

	return nil
}

func (ptp paymentTransactionPersistence) RevokeExpired(ctx context.Context) error {
	query := `DELETE FROM payment_transactions WHERE expired_at > CURRENT_TIMESTAMP`

	_, err := ptp.db.Exec(query)

	if err != nil {
		return xerrors.Errorf("failed to delete expired payment transaction: %w", err)
	}

	return nil
}
