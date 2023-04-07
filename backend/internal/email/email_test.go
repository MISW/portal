package email_test

import (
	"os"
	"testing"

	"github.com/MISW/Portal/backend/internal/email"
)

// go test -run TestSendEmail github.com/MISW/Portal/backend/internal/email -v
func TestSendEmail(t *testing.T) {
	s, ok1 := os.LookupEnv("SMTP_SERVER")      //smtp server
	p, ok2 := os.LookupEnv("SMTP_PORT")        //smtp port
	pass, ok3 := os.LookupEnv("SMTP_PASSWORD") //smtp password
	from, ok4 := os.LookupEnv("SMTP_FROM")     //email from
	u, ok5 := os.LookupEnv("SMTP_USERNAME")    //smtp username
	to, ok6 := os.LookupEnv("TEST_EMAIL_TO")   //email to

	if !(ok1 && ok2 && ok3 && ok4 && ok5 && ok6) {
		t.Errorf("some of env values are not set")
		return
	}

	sender := email.NewSender(s, p, u, pass, from)
	if err := sender.Send(to, "test subject", "test body"); err != nil {
		t.Errorf("failed to send email: %+v", err)
	}
}
