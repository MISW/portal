package email

import (
	"bytes"
	"encoding/base64"
	"net/mail"
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
	fromAddr := mail.Address{Address: es.from}
	toAddr := mail.Address{Address: to}

	payload := bytes.NewBuffer(nil)

	// header
	payload.WriteString("From: " + fromAddr.String() + "\r\n")
	payload.WriteString("To: " + toAddr.String() + "\r\n")
	payload.WriteString(encodeSubject(subject))
	payload.WriteString("MIME-Version: 1.0\r\n")
	payload.WriteString("Content-Type: text/plain; charset=\"utf-8\"\r\n")
	payload.WriteString("Content-Transfer-Encoding: base64\r\n")
	payload.WriteString("\r\n")

	split := splitInLength(
		base64.StdEncoding.EncodeToString([]byte(body)),
		76,
	)

	for i := range split {
		payload.WriteString(split[i])
	}

	return payload.String()
}

func (es *sender) Send(to, subject, body string) error {
	auth := smtp.PlainAuth("", es.username, es.password, es.smtpServer)
	if err := smtp.SendMail(es.smtpServer+":25", auth, es.from, []string{to}, []byte(es.composeBody(to, subject, body))); err != nil {
		return xerrors.Errorf("failed to send email: %w", err)
	}
	return nil
}
