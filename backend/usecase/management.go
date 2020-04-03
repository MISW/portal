package usecase

import (
	"context"
	"time"

	"github.com/MISW/Portal/backend/internal/rest"

	"golang.org/x/xerrors"

	"github.com/MISW/Portal/backend/domain/repository"

	"github.com/MISW/Portal/backend/domain"
)

// ManagementUsecase - 管理者が利用する処理の一覧
type ManagementUsecase interface {
	// ListUsers - 全てのユーザを一覧表示する
	ListUsers(ctx context.Context) ([]*domain.User, error)

	// AuthorizeTransaction - 支払い済登録申請を許可する
	AuthorizeTransaction(ctx context.Context, token string) error
}

type managementUsecase struct {
	userRepository               repository.UserRepository
	paymentStatusRepository      repository.PaymentStatusRepository
	paymentTransactionRepository repository.PaymentTransactionRepository
}

// NewManagementUsecase - management usecaseの初期化
func NewManagementUsecase(
	userRepository repository.UserRepository,
	paymentStatusRepository repository.PaymentStatusRepository,
	paymentTransactionRepository repository.PaymentTransactionRepository,
) ManagementUsecase {
	return &managementUsecase{
		userRepository:               userRepository,
		paymentStatusRepository:      paymentStatusRepository,
		paymentTransactionRepository: paymentTransactionRepository,
	}
}

var _ ManagementUsecase = &managementUsecase{}

func (mu *managementUsecase) ListUsers(ctx context.Context) ([]*domain.User, error) {
	users, err := mu.userRepository.List(ctx)

	if err != nil {
		return nil, xerrors.Errorf("failed to list users: %w", err)
	}

	return users, nil
}

func (mu *managementUsecase) AuthorizeTransaction(ctx context.Context, token string) error {
	transaction, err := mu.paymentTransactionRepository.Get(ctx, token)

	if err != nil {
		if xerrors.Is(err, domain.ErrNoPaymentTransaction) {
			return rest.NewBadRequest("無効なトークンです")
		}

		return xerrors.Errorf("failed to get payment transaction: %w", err)
	}

	if time.Now().After(transaction.ExpiredAt) {
		return rest.NewBadRequest("無効なトークンです")
	}

	//transaction.UserID

	return nil
}
