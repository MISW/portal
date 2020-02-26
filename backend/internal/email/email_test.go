// +build domestic

package email_test

import (
	"testing"

	"github.com/MISW/Portal/backend/internal/email"
)

func TestSendEmail(t *testing.T) {
	smtpServer := "mis-w.sakura.ne.jp"
	username := "noreply@misw.jp"
	password := "EmJ%2o5$plkeA$LA0hzNY7*MC3dSxHbA"

	sender := email.NewSender(smtpServer, username, password, username)

	if err := sender.Send("misw.sysad@gmail.com", "メール送信テスト", "Hello, world!"); err != nil {
		t.Fatalf("failed to send email: %+v", err)
	}
}
