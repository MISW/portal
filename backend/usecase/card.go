package usecase

import (
	"context"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"golang.org/x/xerrors"
)

// CardUsecase - 会員証関連の処理
type CardUsecase interface {
	// Get - 会員証を取得する
	Get(ctx context.Context, userID int) (*domain.Card, error)
}

// NewCardUsecase - 会員証関連のユースケースを初期化
func NewCardUsecase(userRepository repository.UserRepository) CardUsecase {
	return &cardUsecase{
		userRepository: userRepository,
	}
}

type cardUsecase struct {
	userRepository repository.UserRepository
}

var _ CardUsecase = &cardUsecase{}

func (cu *cardUsecase) Get(ctx context.Context, userID int) (*domain.Card, error) {
	u, err := cu.userRepository.GetByID(ctx, userID)

	if err != nil {
		return nil, xerrors.Errorf("failed to get profile for user(%d): %w", userID, err)
	}

	c, err := domain.GetCardFromUser(u)

	if err != nil {
		return nil, xerrors.Errorf("failed to get card for user(%d): %w", userID, err)
	}

	return c, nil
}
