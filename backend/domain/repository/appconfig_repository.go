package repository

type AppConfigRepository interface {
	GetPaymentPeriod() (int, error)

	SetPaymentPeriod(period int) error
}
