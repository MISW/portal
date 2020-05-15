// +build domestic

package email_test

import (
	"testing"

	"github.com/MISW/Portal/backend/internal/email"
)

const (
	subject = "メール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\nメール送信テスト\n"

	body = "ハローワールド\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\nHello, world!\n"
)

func TestSendEmail(t *testing.T) {
	smtpServer := "mis-w.sakura.ne.jp"
	username := "noreply@misw.jp"
	password := "EmJ%2o5$plkeA$LA0hzNY7*MC3dSxHbA"

	sender := email.NewSender(smtpServer, username, password, username)

	if err := sender.Send("misw.sysad@gmail.com", subject, body); err != nil {
		t.Fatalf("failed to send email: %+v", err)
	}
}
