package usecase

import "github.com/MISW/Portal/backend/domain/repository"

// AppConfigUsecase - 管理者用、全体
type AppConfigUsecase interface {
	// payment periodは支払う対象の期間

	GetPaymentPeriod() (int, error)

	SetPaymentPeriod(period int) error

	// current periodは現在の期間(支払済でないとメンバーでないと見做されない期間)

	GetCurrentPeriod() (int, error)

	SetCurrentPeriod(period int) error
}

type appConfigUsecase struct {
	appConfigRepository repository.AppConfigRepository
}

// NewAppConfigUsecase - app config usecaseの初期化
func NewAppConfigUsecase(appConfigRepository repository.AppConfigRepository) AppConfigUsecase {
	return &appConfigUsecase{
		appConfigRepository: appConfigRepository,
	}
}

var _ AppConfigUsecase = &appConfigUsecase{}

func (acu *appConfigUsecase) GetPaymentPeriod() (int, error) {
	panic("not implemented")
}

func (acu *appConfigUsecase) SetPaymentPeriod(period int) error {
	panic("not implemented")
}

func (acu *appConfigUsecase) GetCurrentPeriod() (int, error) {
	panic("not implemented")
}

func (acu *appConfigUsecase) SetCurrentPeriod(period int) error {
	panic("not implemented")
}
