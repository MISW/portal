// +build use_external_db

package persistence_test

import (
	"testing"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/testutil"
)

func TestAppConfig_PaymentPeriod(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	acp := persistence.NewAppConfigPersistence(conn)

	if period, err := acp.GetPaymentPeriod(); err != nil {
		t.Errorf("failed to get default value: %+v", err)
	} else if period != 202004 {
		t.Errorf("default value is different from 202004: %+v", period)
	}

	newValue := 201804

	if err := acp.SetPaymentPeriod(newValue); err != nil {
		t.Errorf("failed to set value: %+v", err)
	}

	if period, err := acp.GetPaymentPeriod(); err != nil {
		t.Errorf("failed to get updated value: %+v", err)
	} else if period != newValue {
		t.Errorf("updated value is different from %d: %+v", newValue, period)
	}
}

func TestAppConfig_CurrentPeriod(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	acp := persistence.NewAppConfigPersistence(conn)

	if period, err := acp.GetCurrentPeriod(); err != nil {
		t.Errorf("failed to get default value: %+v", err)
	} else if period != 201910 {
		t.Errorf("default value is different from 202004: %+v", period)
	}

	newValue := 201804

	if err := acp.SetCurrentPeriod(newValue); err != nil {
		t.Errorf("failed to set value: %+v", err)
	}

	if period, err := acp.GetCurrentPeriod(); err != nil {
		t.Errorf("failed to get updated value: %+v", err)
	} else if period != newValue {
		t.Errorf("updated value is different from %d: %+v", newValue, period)
	}
}

func TestAppConfig_EmailTemplate(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	acp := persistence.NewAppConfigPersistence(conn)

	subject := "subject!"
	body := "body: あいうえお"

	if err := acp.SetEmailTemplate(domain.EmailVerification, subject, body); err != nil {
		t.Errorf("failed to set email template for %s: %+v", domain.EmailVerification, err)
	}

	s, b, err := acp.GetEmailTemplate(domain.EmailVerification)

	if err != nil {
		t.Errorf("failed to save email template for %s: %v", domain.EmailVerification, err)
	}

	if s != subject {
		t.Errorf("subject mismatched: expected: %s, actual: %s", subject, s)
	}

	if b != body {
		t.Errorf("body mismatched: expected: %s, actual: %s", body, b)
	}
}
