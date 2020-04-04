// +build use_external_db

package persistence_test

import (
	"testing"

	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/testutil"
)

func TestAppConfig_PaymentPeriod(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	acp := persistence.NewAppConfigPersistence(conn)

	if period, err := acp.GetPaymentPeriod(); err != nil {
		t.Fatalf("failed to get default value: %+v", err)
	} else if period != 202004 {
		t.Fatalf("default value is different from 202004: %+v", period)
	}

	newValue := 201804

	if err := acp.SetPaymentPeriod(newValue); err != nil {
		t.Fatalf("failed to set value: %+v", err)
	}

	if period, err := acp.GetPaymentPeriod(); err != nil {
		t.Fatalf("failed to get updated value: %+v", err)
	} else if period != 202004 {
		t.Fatalf("updated value is different from %d: %+v", newValue, period)
	}
}
