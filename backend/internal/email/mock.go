package email

import "log"

type mockSender struct {
}

// NewMock is a mock for Sender
func NewMock() Sender {
	return &mockSender{}
}

func (s *mockSender) Send(to, subject, body string) error {
	return s.logPrintln(to, subject, body)
}

func (s *mockSender) logPrintln(to, subject, body string) error {
	log.Println("Sending Email:\nTo: " + to + "\r\n" +
		"Subject: " + subject + "\r\n\r\n" +
		body + "\r\n")
	return nil
}
