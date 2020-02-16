// +build use_external_db

package persistence_test

import (
	"testing"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/MISW/Portal/backend/internal/testutil"
	"github.com/google/go-cmp/cmp"
)

var (
	paymentStatusTemplate = &domain.PaymentStatus{
		UserID:     10,
		Period:     201010,
		Authorizer: 2,
	}

	// same in user_id
	paymentStatusTemplate2 = &domain.PaymentStatus{
		UserID:     10,
		Period:     201004,
		Authorizer: 2,
	}

	// same in period
	paymentStatusTemplate3 = &domain.PaymentStatus{
		UserID:     12,
		Period:     201010,
		Authorizer: 2,
	}

	paymentStatusTemplates = []*domain.PaymentStatus{
		paymentStatusTemplate,
		paymentStatusTemplate2,
		paymentStatusTemplate3,
	}
)

func comparePaymentStatus(t *testing.T, expected *domain.PaymentStatus, actual *domain.PaymentStatus) {
	t.Helper()

	e := *expected
	expected = &e

	if actual.CreatedAt.Before(time.Now().Add(-1*time.Minute)) || actual.CreatedAt.After(time.Now()) {
		t.Fatalf("created_at is invalid: %+v", actual.CreatedAt)
	}
	if actual.UpdatedAt.Before(time.Now().Add(-1*time.Minute)) || actual.UpdatedAt.After(time.Now()) {
		t.Fatalf("updated_at is invalid: %+v", actual.UpdatedAt)
	}

	expected.CreatedAt = actual.CreatedAt
	expected.UpdatedAt = actual.UpdatedAt

	if diff := cmp.Diff(expected, actual); diff != "" {
		t.Fatalf("users differ: %v", diff)
	}
}

func insertTestPaymentStatusData(t *testing.T, conn db.Ext, psp repository.PaymentStatusRepository) {
	t.Helper()

	for _, ps := range paymentStatusTemplates {
		err := psp.Add(conn, ps.UserID, ps.Period, ps.Authorizer)

		if err != nil {
			t.Fatalf("inserting a new user to db failed(%v): %+v", ps, err)
		}
	}
}

func TestPaymentStatusInsert(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	psp := persistence.NewPaymentStatusPersistence()

	insertTestPaymentStatusData(t, conn, psp)

	err := psp.Add(conn, paymentStatusTemplate.UserID, paymentStatusTemplate.Period, paymentStatusTemplate.Authorizer)

	if err != domain.ErrAlreadyPaid {
		t.Fatalf("conflicting insert should return ErrAlreadyPaid but got %+v", err)
	}
}

func TestPaymentStatusGet(t *testing.T) {
	t.Run("get_latest", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		psp := persistence.NewPaymentStatusPersistence()

		insertTestPaymentStatusData(t, conn, psp)

		ps, err := psp.GetLatestByUser(conn, paymentStatusTemplate.UserID)

		if err != nil {
			t.Fatalf("failed to get latest payment status by id: %+v", err)
		}

		comparePaymentStatus(t, paymentStatusTemplate, ps)
	})

}

func TestPaymentStatusList(t *testing.T) {
	t.Run("for_period", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		psp := persistence.NewPaymentStatusPersistence()

		insertTestPaymentStatusData(t, conn, psp)

		pss, err := psp.ListUsersForPeriod(conn, paymentStatusTemplate.Period)

		if err != nil {
			t.Fatalf("failed to list payment statuses: %+v", err)
		}

		if expected := 2; len(pss) != expected {
			t.Fatalf("list should return %d payment statuses, but returned %d", expected, len(pss))
		}

		comparePaymentStatus(t, paymentStatusTemplate, pss[0])
		comparePaymentStatus(t, paymentStatusTemplate3, pss[1])
	})

	t.Run("for_user", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		psp := persistence.NewPaymentStatusPersistence()

		insertTestPaymentStatusData(t, conn, psp)

		pss, err := psp.ListPeriodsForUser(conn, paymentStatusTemplate.UserID)

		if err != nil {
			t.Fatalf("failed to list payment statuses: %+v", err)
		}

		if expected := 2; len(pss) != expected {
			t.Fatalf("list should return %d payment statuses, but returned %d", expected, len(pss))
		}

		comparePaymentStatus(t, paymentStatusTemplate, pss[0])
		comparePaymentStatus(t, paymentStatusTemplate2, pss[1])
	})
}
