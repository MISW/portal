package usecase

import (
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/rest"
	"golang.org/x/xerrors"
)

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
	userRoleRepository repository.UserRoleRepository
}

// NewAppConfigUsecase - app config usecaseの初期化
func NewAppConfigUsecase(appConfigRepository repository.AppConfigRepository, userRoleRepository repository.UserRoleRepository) AppConfigUsecase {
	return &appConfigUsecase{
		appConfigRepository: appConfigRepository,
		userRoleRepository userRoleRepository,
	}
}

var _ AppConfigUsecase = &appConfigUsecase{}

func (acu *appConfigUsecase) diffPeriod(a, b int) int {
	year := a/100 - b/100

	return year*2 + (a%100-b%100)/6
}

func (acu *appConfigUsecase) validatePeriod(period int) error {
	year := period / 100
	month := period % 100

	if year > 2100 || year < 2019 {
		return rest.NewBadRequest("年の値が不正です")
	}

	// これ以外を追加する場合、diffPeriodも修正する必要あり
	if month != 4 && month != 10 {
		return rest.NewBadRequest("4月または10月のみが許可されています")
	}

	return nil
}

func (acu *appConfigUsecase) GetPaymentPeriod() (int, error) {
	period, err := acu.appConfigRepository.GetPaymentPeriod()

	if err != nil {
		return 0, xerrors.Errorf("failed to get payment period: %w", err)
	}

	return period, nil
}

func (acu *appConfigUsecase) SetPaymentPeriod(period int) error {
	if err := acu.validatePeriod(period); err != nil {
		return err
	}

	currentPeriod, err := acu.appConfigRepository.GetCurrentPeriod()

	if err != nil {
		return xerrors.Errorf("failed to get current period: %w", err)
	}

	if period := acu.diffPeriod(period, currentPeriod); period < 0 || period > 1 {
		return rest.NewBadRequest("支払い期間は現在の期間と同じか一つ次のみ指定できます")
	}

	if err := acu.appConfigRepository.SetPaymentPeriod(period); err != nil {
		return xerrors.Errorf("failed to set payment period: %w", err)
	}

	if err := acu.userRoleRepository.UpdateAllWithRule(ctx, currentPeriod, period); err != nil {
		return xerrors.Errorf("failed to update users' role automatically: %w", err)
	}

	return nil
}

func (acu *appConfigUsecase) GetCurrentPeriod() (int, error) {
	period, err := acu.appConfigRepository.GetCurrentPeriod()

	if err != nil {
		return 0, xerrors.Errorf("failed to get current period: %w", err)
	}

	return period, nil
}

func (acu *appConfigUsecase) SetCurrentPeriod(period int) error {
	if err := acu.validatePeriod(period); err != nil {
		return err
	}

	paymentPeriod, err := acu.appConfigRepository.GetPaymentPeriod()

	if err != nil {
		return xerrors.Errorf("failed to get current period: %w", err)
	}

	if period := acu.diffPeriod(period, paymentPeriod); period < 0 || period > 1 {
		return rest.NewBadRequest("現在の期間は現在の期間と同じか一つ次のみ指定できます")
	}

	if err := acu.appConfigRepository.SetCurrentPeriod(period); err != nil {
		return xerrors.Errorf("failed to set current period: %w", err)
	}

	if err := acu.userRoleRepository.UpdateAllWithRule(ctx, period, paymentPeriod); err != nil {
		return xerrors.Errorf("failed to update users' role automatically: %w", err)
	}

	return nil
}
