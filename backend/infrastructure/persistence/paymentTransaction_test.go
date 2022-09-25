//go:build use_external_db
// +build use_external_db

package persistence_test

import (
	"context"
	"testing"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/testutil"
	"github.com/google/go-cmp/cmp"
)

var (
	now = time.Unix(time.Now().Unix(), 0)

	paymentTransactionTestData1 = &domain.PaymentTransaction{
		Token:  "token1",
		UserID: 1,

		ExpiredAt: now.Add(30 * time.Second),
	}

	paymentTransactionTestData2 = &domain.PaymentTransaction{
		Token:  "token2",
		UserID: 1,

		ExpiredAt: now.Add(-30 * time.Second), // Expired
	}

	paymentTransactionTestData = []*domain.PaymentTransaction{
		paymentTransactionTestData1,
		paymentTransactionTestData2,
	}
)

func comparePaymentTransaction(t *testing.T, expected *domain.PaymentTransaction, actual *domain.PaymentTransaction) {
	t.Helper()

	e := *expected
	expected = &e

	if actual.CreatedAt.Before(time.Now().Add(-1*time.Minute)) || actual.CreatedAt.After(time.Now()) {
		t.Errorf("created_at is invalid: %+v", actual.CreatedAt)
	}

	expected.CreatedAt = actual.CreatedAt

	if diff := cmp.Diff(expected, actual); diff != "" {
		t.Errorf("payment transactions differ: %v", diff)
	}
}

func insertTestPaymentTransactionsData(t *testing.T, ptp repository.PaymentTransactionRepository) {
	t.Helper()

	for _, ps := range paymentTransactionTestData {
		err := ptp.Add(context.Background(), ps.UserID, ps.Token, ps.ExpiredAt)

		if err != nil {
			t.Errorf("inserting a new user to db failed(%v): %+v", ps, err)
		}
	}
}

func TestPaymentTransactionPersistenceAdd(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	ptp := persistence.NewPaymentTransactionPersistence(conn)

	insertTestPaymentTransactionsData(t, ptp)
}

func TestPaymentTransactionPersistenceGet(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	ptp := persistence.NewPaymentTransactionPersistence(conn)

	insertTestPaymentTransactionsData(t, ptp)

	pt, err := ptp.Get(context.Background(), paymentTransactionTestData1.Token)

	if err != nil {
		t.Errorf("failed to get payment transaction by token(%s): %+v", paymentTransactionTestData1.Token, err)
	}

	comparePaymentTransaction(t, paymentTransactionTestData1, pt)
}

func TestPaymentTransactionPersistenceDelete(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	ptp := persistence.NewPaymentTransactionPersistence(conn)

	insertTestPaymentTransactionsData(t, ptp)

	err := ptp.Delete(context.Background(), paymentTransactionTestData1.Token)

	if err != nil {
		t.Errorf("failed to delete payment transaction: %+v", err)
	}

	_, err = ptp.Get(context.Background(), paymentTransactionTestData1.Token)

	if err != domain.ErrNoPaymentTransaction {
		t.Errorf("error on deleted payment transaction should be ErrNoPaymentTransaction, but got %+v", err)
	}
}

func TestPaymentTransactionPersistenceRevokeExpired(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	ptp := persistence.NewPaymentTransactionPersistence(conn)

	insertTestPaymentTransactionsData(t, ptp)

	err := ptp.RevokeExpired(context.Background())

	if err != nil {
		t.Errorf("failed to delete payment transaction: %+v", err)
	}

	_, err = ptp.Get(context.Background(), paymentTransactionTestData2.Token)

	if err != domain.ErrNoPaymentTransaction {
		t.Errorf("error for expired token should be ErrNoPaymentTransaction, but got: %+v", err)
	}

	_, err = ptp.Get(context.Background(), paymentTransactionTestData1.Token)

	if err != nil {
		t.Errorf("not expired should not be deleted, but got %+v", err)
	}
}
