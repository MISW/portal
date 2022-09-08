package email_test

import (
	"os"
	"testing"

	"github.com/MISW/Portal/backend/internal/email"
)

//go test -run TestSendEmail github.com/MISW/Portal/backend/internal/email -v
func TestSendEmail(t *testing.T) {
	s := os.Getenv("TEST_EMAIL_SMTP_SERVER") //smtp server
	pass := os.Getenv("TEST_EMAIL_PASS")     //smtp password
	from := os.Getenv("TEST_EMAIL_FROM")     //email from
	u := os.Getenv("TEST_EMAIL_TO")          //smtp username
	to := os.Getenv("TEST_EMAIL_TO")         //email to
	sender := email.NewSender(s, u, pass, from)
	if err := sender.Send(to, "test subject", "test body"); err != nil {
		t.Errorf("failed to send email: %+v", err)
	}
}
