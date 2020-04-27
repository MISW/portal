// +build use_external_db

package persistence_test

import (
	"testing"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/testutil"
	"github.com/google/go-cmp/cmp"
	"golang.org/x/net/context"
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
		t.Fatalf("payment statuses differ: %v", diff)
	}
}

func insertTestPaymentStatusData(t *testing.T, psp repository.PaymentStatusRepository) {
	t.Helper()

	for _, ps := range paymentStatusTemplates {
		err := psp.Add(context.Background(), ps.UserID, ps.Period, ps.Authorizer)

		if err != nil {
			t.Fatalf("inserting a new user to db failed(%v): %+v", ps, err)
		}
	}
}

func TestPaymentStatusInsert(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	psp := persistence.NewPaymentStatusPersistence(conn)

	insertTestPaymentStatusData(t, psp)

	err := psp.Add(context.Background(), paymentStatusTemplate.UserID, paymentStatusTemplate.Period, paymentStatusTemplate.Authorizer)

	if err != domain.ErrAlreadyPaid {
		t.Fatalf("conflicting insert should return ErrAlreadyPaid but got %+v", err)
	}
}

func TestPaymentStatusGet(t *testing.T) {
	t.Run("get_latest", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		psp := persistence.NewPaymentStatusPersistence(conn)

		insertTestPaymentStatusData(t, psp)

		ps, err := psp.GetLatestByUser(context.Background(), paymentStatusTemplate.UserID)

		if err != nil {
			t.Fatalf("failed to get latest payment status by id: %+v", err)
		}

		comparePaymentStatus(t, paymentStatusTemplate, ps)
	})

	t.Run("get", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		psp := persistence.NewPaymentStatusPersistence(conn)

		insertTestPaymentStatusData(t, psp)

		ps, err := psp.Get(context.Background(), paymentStatusTemplate.UserID, paymentStatusTemplate.Period)

		if err != nil {
			t.Fatalf("failed to get latest payment status by id: %+v", err)
		}

		comparePaymentStatus(t, paymentStatusTemplate, ps)
	})
}

func TestPaymentStatusDelete(t *testing.T) {
	t.Run("get_latest", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		psp := persistence.NewPaymentStatusPersistence(conn)

		insertTestPaymentStatusData(t, psp)

		deleted, err := psp.Delete(context.Background(), paymentStatusTemplate.UserID, paymentStatusTemplate.Period)

		if err != nil {
			t.Fatalf("failed to delete payment status: %+v", err)
		}

		if !deleted {
			t.Fatalf("delete should return true")
		}

		_, err = psp.Get(context.Background(), paymentStatusTemplate.UserID, paymentStatusTemplate.Period)

		if err != domain.ErrNoPaymentStatus {
			t.Fatalf("error on deleted item should be ErrNoPaymentStatus, but got: %+v", err)
		}

		deleted, err = psp.Delete(context.Background(), paymentStatusTemplate.UserID, paymentStatusTemplate.Period)

		if err != nil {
			t.Fatalf("deletion on deleted item should return no error: %+v", err)
		}

		if deleted {
			t.Fatalf("deletion on deleted item should return false")
		}
	})
}

func TestPaymentStatusList(t *testing.T) {
	t.Run("for_period", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		psp := persistence.NewPaymentStatusPersistence(conn)

		insertTestPaymentStatusData(t, psp)

		pss, err := psp.ListUsersForPeriod(context.Background(), paymentStatusTemplate.Period)

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

		psp := persistence.NewPaymentStatusPersistence(conn)

		insertTestPaymentStatusData(t, psp)

		pss, err := psp.ListPeriodsForUser(context.Background(), paymentStatusTemplate.UserID)

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

func TestPaymentIsXXX(t *testing.T) {
	t.Run("latest", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		psp := persistence.NewPaymentStatusPersistence(conn)

		insertTestPaymentStatusData(t, psp)

		res, err := psp.IsLatest(context.Background(), paymentStatusTemplate.UserID, paymentStatusTemplate.Period)

		if err != nil {
			t.Fatalf("failed to call IsLatest: %+v", err)
		}

		if !res {
			t.Fatalf("202010 is the latest, but false is returned")
		}

		res, err = psp.IsLatest(context.Background(), paymentStatusTemplate2.UserID, paymentStatusTemplate2.Period)

		if err != nil {
			t.Fatalf("failed to call IsLatest: %+v", err)
		}

		if res {
			t.Fatalf("202004 is not the latest, but true is returned")
		}
	})

	t.Run("first", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		psp := persistence.NewPaymentStatusPersistence(conn)

		insertTestPaymentStatusData(t, psp)

		res, err := psp.IsFirst(context.Background(), paymentStatusTemplate.UserID, paymentStatusTemplate.Period)

		if err != nil {
			t.Fatalf("failed to call IsLatest: %+v", err)
		}

		if res {
			t.Fatalf("202010 is not the first, but true is returned")
		}

		res, err = psp.IsFirst(context.Background(), paymentStatusTemplate2.UserID, paymentStatusTemplate2.Period)

		if err != nil {
			t.Fatalf("failed to call IsLatest: %+v", err)
		}

		if !res {
			t.Fatalf("202004 is the first, but false is returned")
		}
	})
}

func TestPaymentStatusHasMatchingPeriod(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	psp := persistence.NewPaymentStatusPersistence(conn)

	insertTestPaymentStatusData(t, psp)

	// no parameter
	matched, err := psp.HasMatchingPeriod(
		context.Background(),
		paymentStatusTemplate.UserID,
		[]int{},
	)

	if err != nil {
		t.Fatalf("HasMatchingPeriod failed: %+v", err)
	}

	if matched {
		t.Fatal("should be false, but got true")
	}

	// has a matching parameter
	matched, err = psp.HasMatchingPeriod(
		context.Background(),
		paymentStatusTemplate.UserID,
		[]int{paymentStatusTemplate.Period, 100},
	)

	if err != nil {
		t.Fatalf("HasMatchingPeriod failed: %+v", err)
	}

	if !matched {
		t.Fatal("should be true, but got false")
	}

	// no matching parameter
	matched, err = psp.HasMatchingPeriod(
		context.Background(),
		paymentStatusTemplate.UserID,
		[]int{100},
	)

	if err != nil {
		t.Fatalf("HasMatchingPeriod failed: %+v", err)
	}

	if matched {
		t.Fatal("should be false, but got true")
	}
}
