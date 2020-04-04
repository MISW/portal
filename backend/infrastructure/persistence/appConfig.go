package persistence

import (
	"database/sql"
	"strconv"

	"golang.org/x/xerrors"

	"github.com/jmoiron/sqlx"

	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/db"
)

// NewAppConfigPersistence - Portalのグローバル設定を管理するAppConfigのPersistence
func NewAppConfigPersistence(db db.Ext) repository.AppConfigRepository {
	return &appConfigPersistence{db: db}
}

type appConfigPersistence struct {
	db db.Ext
}

var _ repository.AppConfigRepository = &appConfigPersistence{}

const (
	paymentPeriod        = "payment-period-v1"
	defaultPaymentPeriod = 202004
)

func (acp *appConfigPersistence) GetPaymentPeriod() (int, error) {
	period, err := acp.getValue(paymentPeriod)

	if xerrors.Is(err, sql.ErrNoRows) {
		return defaultPaymentPeriod, nil
	}

	if err != nil {
		return 0, xerrors.Errorf("failed to get payment period: %w", err)
	}

	p, err := strconv.Atoi(period)

	if err != nil {
		return defaultPaymentPeriod, nil
	}

	return p, nil
}

func (acp *appConfigPersistence) SetPaymentPeriod(period int) error {
	if err := acp.setValue(paymentPeriod, strconv.Itoa(period)); err != nil {
		return xerrors.Errorf("failed to set payment period: %w", err)
	}

	return nil
}

func (acp *appConfigPersistence) getValue(key string) (string, error) {
	var value string

	err := sqlx.Get(
		acp.db,
		&value,
		"SELECT value FROM appconfig WHERE key=?",
		key,
	)

	if err != nil {
		return "", xerrors.Errorf("failed to get value from appconfig table: %w", err)
	}

	return value, nil
}

func (acp *appConfigPersistence) setValue(key, value string) error {
	_, err := acp.db.Exec("INSERT INTO appconfig (key, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value=?", key, value, value)

	if err != nil {
		return xerrors.Errorf("failed to get value from appconfig table: %w", err)
	}

	return nil
}
