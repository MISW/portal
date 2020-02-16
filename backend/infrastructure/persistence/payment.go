package persistence

import (
	"database/sql"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"golang.org/x/xerrors"
)

// NewPaymentStatusPersistence - ユーザのMySQL関連の実装
func NewPaymentStatusPersistence() repository.PaymentStatusRepository {
	return &paymentStatusPersistence{}
}

type paymentStatus struct {
	ID         int `db:"id"`
	UserID     int `json:"user_id" yaml:"user_id"`
	Authorizer int `json:"authorizer"`

	// Period - 支払い区間(201904, 201910のようにYYYYMM)
	Period int `json:"period" yaml:"period"`

	CreatedAt time.Time `json:"created_at" yaml:"created_at"`
	UpdatedAt time.Time `json:"updated_at" yaml:"updated_at"`
}

func newPaymentStatus(ps *domain.PaymentStatus) *paymentStatus {
	return &paymentStatus{
		UserID:     ps.UserID,
		Authorizer: ps.Authorizer,
		Period:     ps.Period,
		CreatedAt:  ps.CreatedAt,
		UpdatedAt:  ps.UpdatedAt,
	}
}

func parsePaymentStatus(ps *paymentStatus) *domain.PaymentStatus {
	return &domain.PaymentStatus{
		UserID:     ps.UserID,
		Authorizer: ps.Authorizer,
		Period:     ps.Period,
		CreatedAt:  ps.CreatedAt,
		UpdatedAt:  ps.UpdatedAt,
	}
}

type paymentStatusPersistence struct {
}

var _ repository.PaymentStatusRepository = &paymentStatusPersistence{}

// Insert - 新しい支払情報の追加
func (psp *paymentStatusPersistence) Add(db db.Ext, userID, period, authorizer int) error {
	_, err := db.Exec(
		`INSERT INTO payment_statuses (
			user_id,
			period,
			authorizer
		) VALUES (
			?,?,?
		)`, userID, period, authorizer)

	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return domain.ErrAlreadyPaid
		}

		return xerrors.Errorf("failed to add new payment status: %w", err)
	}

	return nil
}

// GetLatestByUser - 最新の支払情報の取得
func (psp *paymentStatusPersistence) GetLatestByUser(db db.Ext, userID int) (*domain.PaymentStatus, error) {
	ps := &domain.PaymentStatus{}

	err := db.QueryRowx(`
		SELECT * FROM payment_statuses WHERE user_id=? ORDER BY period DESC LIMIT 1
	`, userID).StructScan(ps)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, domain.ErrNoPaymentStatus
		}

		return nil, xerrors.Errorf("failed to get payment status for the user(%d): %w", userID, err)
	}

	return ps, nil
}

// ListForPeriod returns all users paying in the period
func (psp *paymentStatusPersistence) ListUsersForPeriod(db db.Ext, period int) ([]*domain.PaymentStatus, error) {
	pss := []*domain.PaymentStatus{}

	err := sqlx.Select(db, &pss,
		`SELECT * FROM payment_statuses WHERE period=? ORDER BY user_id ASC`, period)

	if err != nil {
		return nil, xerrors.Errorf("failed to get payment statuses for the period(%d): %w", period, err)
	}

	return pss, nil
}

// ListForUser returns all periods(ordered by desc) the user paid in
func (psp *paymentStatusPersistence) ListPeriodsForUser(db db.Ext, userID int) ([]*domain.PaymentStatus, error) {
	pss := []*domain.PaymentStatus{}

	err := sqlx.Select(db, &pss,
		`SELECT * FROM payment_statuses WHERE user_id=? ORDER BY period DESC`, userID)

	if err != nil {
		return nil, xerrors.Errorf("failed to get payment statuses for the userID(%d): %w", userID, err)
	}

	return pss, nil
}
