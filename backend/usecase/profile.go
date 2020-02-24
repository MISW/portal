package usecase

import (
	"context"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"golang.org/x/xerrors"
)

// ProfileUsecase - プロフィール関連の処理
type ProfileUsecase interface {
	// Get - 自分自身のプロフィール情報を取得する
	Get(ctx context.Context, userID int) (*domain.User, error)
	// Update - 自分自身のプロフィール情報を更新する
	Update(ctx context.Context, registeredUser, user *domain.User) (*domain.User, error)

	// GetPaymentStatuses - 自分自身の支払い状況を取得する
	GetPaymentStatuses(ctx context.Context, userID int) ([]*domain.PaymentStatus, error)
}

// NewProfileUsecase - ユーザ関連のユースケースを初期化
func NewProfileUsecase(userRepository repository.UserRepository, paymentStatusRepository repository.PaymentStatusRepository) NewProfileUsecase {
	return &profileUsecase{
		userRepository:          userRepository,
		paymentStatusRepository: paymentStatusRepository,
	}
}

type profileUsecase struct {
	userRepository          repository.UserRepository
	paymentStatusRepository repository.PaymentStatusRepository
}

var _ ProfileUsecase = &profileUsecase{}

// Get - 自分自身のプロフィール情報を取得する
func (pu *profileUsecase) Get(ctx context.Context, userID int) (*domain.User, error) {
	u, err := pu.userRepository.GetByID(ctx, userID)

	if err != nil {
		return nil, xerrors.Errorf("failed to get profile for user(%d): %w", userID, err)
	}

	return u, nil
}

// Update - 自分自身のプロフィール情報を更新する
func (pu *profileUsecase) Update(ctx context.Context, registeredUser, user *domain.User) (*domain.User, error) {
	user.SlackID = registeredUser.SlackID
	user.Role = registeredUser.Role

	if err := pu.userRepository.Update(ctx, user); err != nil {
		return nil, xerrors.Errorf("failed to update user(%d): %w", user.ID, err)
	}

	user, err := pu.userRepository.GetByID(ctx, user.ID)

	if err != nil {
		return nil, xerrors.Errorf("failed to get user(%d): %w", user.ID, err)
	}

	return user, nil
}

// GetPaymentStatuses - 自分自身の支払い状況を取得する
func (pu *profileUsecase) GetPaymentStatuses(ctx context.Context, userID int) ([]*domain.PaymentStatus, error) {
	ps, err := pu.paymentStatusRepository.ListPeriodsForUser(ctx, userID)

	if err != nil {
		return nil, xerrors.Errorf("failed to get payment statuses for user(%d): %w", userID, err)
	}

	return ps, nil
}
