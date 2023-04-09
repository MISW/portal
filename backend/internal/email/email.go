package email

import (
	"bytes"
	"encoding/base64"
	"log"
	"net/mail"
	"net/smtp"

	"golang.org/x/xerrors"
)

// Sender - Eメールを送信するやつ
type Sender interface {
	Send(to, subject, body string) error
}

// NewSender - 初期化
func NewSender(smtpServer, smtpPort, username, password, from string) Sender {
	return &sender{
		smtpServer: smtpServer,
		smtpPort:   smtpPort,
		username:   username,
		password:   password,
		from:       from,
	}
}

var _ Sender = &sender{}

type sender struct {
	smtpServer         string
	smtpPort           string
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
	if err := smtp.SendMail(es.smtpServer+":"+es.smtpPort, auth, es.from, []string{to}, []byte(es.composeBody(to, subject, body))); err != nil {
		return xerrors.Errorf("failed to send email: %w", err)
	}
	return nil
}

// unencrypted sender
type unencryptedSender struct {
	sender
}

func NewUnencryptedSender(smtpServer, smtpPort, username, password, from string) Sender {
	log.Println("THIS EMAIL SENDER DOESN'T CHECK IF SMTP CONNECTION IS ENCRYPTED OR NOT.")
	return &unencryptedSender{
		sender{
			smtpServer: smtpServer,
			smtpPort:   smtpPort,
			username:   username,
			password:   password,
			from:       from,
		},
	}
}

type unencryptedAuth struct {
	smtp.Auth
}

func (a unencryptedAuth) Start(server *smtp.ServerInfo) (string, []byte, error) {
	// TLS=trueを強制的にセットすることで暗号化されていなくてもエラーを吐かない. https://cs.opensource.google/go/go/+/ee522e2cdad04a43bc9374776483b6249eb97ec9:src/net/smtp/auth.go;l=61-75
	s := *server
	s.TLS = true
	return a.Auth.Start(&s)
}

func (ues *unencryptedSender) Send(to, subject, body string) error {
	es := ues.sender
	auth := unencryptedAuth{
		smtp.PlainAuth("", es.username, es.password, es.smtpServer),
	}
	if err := smtp.SendMail(es.smtpServer+":"+es.smtpPort, auth, es.from, []string{to}, []byte(es.composeBody(to, subject, body))); err != nil {
		return xerrors.Errorf("failed to send email: %w", err)
	}
	return nil
}
