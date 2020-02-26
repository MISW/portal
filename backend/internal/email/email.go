package email

import (
	"net/smtp"

	"golang.org/x/xerrors"
)

// Sender - Eメールを送信するやつ
type Sender interface {
	Send(to, subject, body string) error
}

// NewSender - 初期化
func NewSender(smtpServer, username, password, from string) Sender {
	return &sender{
		smtpServer: smtpServer,
		username:   username,
		password:   password,
		from:       from,
	}
}

var _ Sender = &sender{}

type sender struct {
	smtpServer         string
	username, password string
	from               string
}

func (es *sender) composeBody(to, subject, body string) string {
	return "To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n\r\n" +
		body + "\r\n"
}

func (es *sender) Send(to, subject, body string) error {
	auth := smtp.PlainAuth("", es.username, es.password, es.smtpServer)
	if err := smtp.SendMail(es.smtpServer+":25", auth, es.from, []string{to}, []byte(es.composeBody(to, subject, body))); err != nil {
		return xerrors.Errorf("failed to send email: %w", err)
	}
	return nil
}
