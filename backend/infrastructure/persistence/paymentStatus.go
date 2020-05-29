package persistence

import (
	"context"
	"database/sql"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"golang.org/x/xerrors"
)

// NewPaymentStatusPersistence - 支払状況のMySQL関連の実装
func NewPaymentStatusPersistence(db db.Ext) repository.PaymentStatusRepository {
	return &paymentStatusPersistence{db: db}
}

type paymentStatus struct {
	ID         int `db:"id"`
	UserID     int `db:"user_id"`
	Authorizer int `db:"authorizer"`

	// Period - 支払い区間(201904, 201910のようにYYYYMM)
	Period int `db:"period"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
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
	db db.Ext
}

var _ repository.PaymentStatusRepository = &paymentStatusPersistence{}

// Add - 新しい支払情報の追加
func (psp *paymentStatusPersistence) Add(ctx context.Context, userID, period, authorizer int) error {
	_, err := psp.db.Exec(
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

// Get - 特定の支払い情報の取得
func (psp *paymentStatusPersistence) Get(ctx context.Context, userID, period int) (*domain.PaymentStatus, error) {
	ps := &paymentStatus{}

	err := sqlx.GetContext(
		ctx, psp.db, ps,
		"SELECT * FROM payment_statuses WHERE user_id=? AND period=?",
		userID, period,
	)

	if err == sql.ErrNoRows {
		return nil, domain.ErrNoPaymentStatus
	}

	if err != nil {
		return nil, xerrors.Errorf("failed to get payment status for (userid: %d, period: %d): %w", userID, period, err)
	}

	return parsePaymentStatus(ps), nil
}

// Delete - 支払情報の削除
func (psp *paymentStatusPersistence) Delete(ctx context.Context, userID, period int) (bool, error) {
	res, err := psp.db.Exec(
		`DELETE FROM payment_statuses WHERE user_id=? AND period=?`,
		userID,
		period,
	)

	if err != nil {
		return false, xerrors.Errorf("failed to delete payment status: %w", err)
	}

	affected, err := res.RowsAffected()

	if err != nil {
		return false, xerrors.Errorf("failed to get rows affected: %w", err)
	}

	return affected != 0, nil
}

// GetLatestByUser - 最新の支払情報の取得
func (psp *paymentStatusPersistence) GetLatestByUser(ctx context.Context, userID int) (*domain.PaymentStatus, error) {
	ps := &paymentStatus{}

	err := psp.db.QueryRowx(`
		SELECT * FROM payment_statuses WHERE user_id=? ORDER BY period DESC LIMIT 1
	`, userID).StructScan(ps)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, domain.ErrNoPaymentStatus
		}

		return nil, xerrors.Errorf("failed to get payment status for the user(%d): %w", userID, err)
	}

	return parsePaymentStatus(ps), nil
}

// ListForPeriod returns all users paying in the period
func (psp *paymentStatusPersistence) ListUsersForPeriod(ctx context.Context, period int) ([]*domain.PaymentStatus, error) {
	pss := []*paymentStatus{}

	err := sqlx.Select(psp.db, &pss,
		`SELECT * FROM payment_statuses WHERE period=? ORDER BY user_id ASC`, period)

	if err != nil {
		return nil, xerrors.Errorf("failed to get payment statuses for the period(%d): %w", period, err)
	}

	res := make([]*domain.PaymentStatus, 0, len(pss))
	for i := range pss {
		res = append(res, parsePaymentStatus(pss[i]))
	}

	return res, nil
}

// ListForUser returns all periods(ordered by desc) the user paid in
func (psp *paymentStatusPersistence) ListPeriodsForUser(ctx context.Context, userID int) ([]*domain.PaymentStatus, error) {
	pss := []*paymentStatus{}

	err := sqlx.Select(psp.db, &pss,
		`SELECT * FROM payment_statuses WHERE user_id=? ORDER BY period DESC`, userID)

	if err != nil {
		return nil, xerrors.Errorf("failed to get payment statuses for the userID(%d): %w", userID, err)
	}

	res := make([]*domain.PaymentStatus, 0, len(pss))
	for i := range pss {
		res = append(res, parsePaymentStatus(pss[i]))
	}

	return res, nil
}

// IsLatest reports the specified payment status is the latest or not.
// CAUTION: This method doesn't check the specified status exists
func (psp *paymentStatusPersistence) IsLatest(ctx context.Context, userID, period int) (bool, error) {
	var counter int

	err := psp.db.QueryRowx(
		`SELECT COUNT(*) FROM payment_statuses WHERE user_id=? AND period > ?`, userID, period,
	).Scan(&counter)

	if err != nil {
		return false, xerrors.Errorf("failed to get payment statuses for the userID(%d): %w", userID, err)
	}

	return counter == 0, nil
}

// IsFirst reports the specified payment status is the first or not.
// CAUTION: This method doesn't check the specified status exists
func (psp *paymentStatusPersistence) IsFirst(ctx context.Context, userID, period int) (bool, error) {
	var counter int

	err := psp.db.QueryRowx(
		`SELECT COUNT(*) FROM payment_statuses WHERE user_id=? AND period < ?`, userID, period,
	).Scan(&counter)

	if err != nil {
		return false, xerrors.Errorf("failed to get payment statuses for the userID(%d): %w", userID, err)
	}

	return counter == 0, nil
}

// HasMatchingPeriod returns whether there is a payment status matching parameters
func (psp *paymentStatusPersistence) HasMatchingPeriod(ctx context.Context, userID int, periods []int) (bool, error) {
	if len(periods) == 0 {
		return false, nil
	}

	query, args, err := sqlx.In(`SELECT COUNT(*) FROM payment_statuses WHERE user_id=? AND period IN (?)`, userID, periods)

	if err != nil {
		return false, xerrors.Errorf("failed to compose a query: %w", err)
	}

	var counter int
	err = psp.db.QueryRowxContext(ctx, query, args...).Scan(&counter)

	if err != nil {
		return false, xerrors.Errorf("failed to count matching payment statuses: %w", err)
	}

	return counter != 0, nil
}

// ListUnpaidMembers returns all unpaid members for the specified period
func (psp *paymentStatusPersistence) ListUnpaidMembers(ctx context.Context, paymentPeriod int) ([]*domain.User, error) {
	query, args, err := sqlx.In(`SELECT u.* FROM users AS u LEFT JOIN payment_statuses AS ps ON u.id=ps.user_id AND period=? where (u.role="member" OR u.role="admin") and ps.id IS NULL`, paymentPeriod)

	if err != nil {
		return nil, xerrors.Errorf("failed to compose a query: %w", err)
	}

	var users []*user
	err = sqlx.SelectContext(ctx, psp.db, &users, query, args...)

	if err != nil {
		return nil, xerrors.Errorf("failed to list unpaid members: %w", err)
	}

	res := make([]*domain.User, len(users))
	for i := range users {
		res[i] = parseUser(users[i])
	}

	return res, nil
}
