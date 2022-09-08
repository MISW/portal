package repository

import "github.com/MISW/Portal/backend/domain"

type AppConfigRepository interface {
	// payment periodは支払う対象の期間

	GetPaymentPeriod() (int, error)

	SetPaymentPeriod(period int) error

	// current periodは現在の期間(支払済でないとメンバーでないと見做されない期間)

	GetCurrentPeriod() (int, error)

	SetCurrentPeriod(period int) error

	// email template

	GetEmailTemplate(kind domain.EmailKind) (subject, body string, err error)

	SetEmailTemplate(kind domain.EmailKind, subject, body string) error
}
