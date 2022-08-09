package email_test

import (
	"os"
	"testing"

	"github.com/MISW/Portal/backend/internal/email"
)

//go test -run TestSendEmail github.com/MISW/Portal/backend/internal/email -v
func TestSendEmail(t *testing.T) {
	s := os.Getenv("server")   //smtp server
	u := os.Getenv("username") //smtp username
	pass := os.Getenv("pass")  //smtp password
	from := os.Getenv("from")  //email from
	to := os.Getenv("to")      //email to
	sender := email.NewSender(s, u, pass, from)
	if err := sender.Send(to, "test subject", "test body"); err != nil {
		t.Fatalf("failed to send email: %+v", err)
	}
}
