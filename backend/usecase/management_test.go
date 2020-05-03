package usecase_test

import (
	"context"
	"testing"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/usecase"
	"github.com/golang/mock/gomock"
	"golang.org/x/xerrors"
)

type managementMock struct {
	appConfigRepository          *repository.MockAppConfigRepository
	paymentStatusRepository      *repository.MockPaymentStatusRepository
	paymentTransactionRepository *repository.MockPaymentTransactionRepository
	userRepository               *repository.MockUserRepository

	managementUsecase usecase.ManagementUsecase
	controller        *gomock.Controller
}

func initManagementMock(t *testing.T) (*managementMock, func()) {
	ctrl := gomock.NewController(t)

	appConfigRepository := repository.NewMockAppConfigRepository(ctrl)
	paymentStatusRepository := repository.NewMockPaymentStatusRepository(ctrl)
	paymentTransactionRepository := repository.NewMockPaymentTransactionRepository(ctrl)
	userRepository := repository.NewMockUserRepository(ctrl)

	uc := usecase.NewManagementUsecase(usecase.ManagementUsecaseParams{
		UserRepository:               userRepository,
		PaymentStatusRepository:      paymentStatusRepository,
		PaymentTransactionRepository: paymentTransactionRepository,
		AppConfigRepository:          appConfigRepository,
	})

	return &managementMock{
		appConfigRepository:          appConfigRepository,
		paymentStatusRepository:      paymentStatusRepository,
		paymentTransactionRepository: paymentTransactionRepository,
		userRepository:               userRepository,

		managementUsecase: uc,
		controller:        ctrl,
	}, ctrl.Finish
}

func TestAddPaymentStatus(t *testing.T) {
	t.Run("not_member_to_member", func(t *testing.T) {
		mock, finish := initManagementMock(t)
		defer finish()

		userID := 10
		paymentPeriod := 202004
		currentPeriod := 201910
		authorizer := 11

		mock.appConfigRepository.
			EXPECT().
			GetPaymentPeriod().
			Return(paymentPeriod, nil)

		mock.appConfigRepository.
			EXPECT().
			GetCurrentPeriod().
			Return(currentPeriod, nil)

		mock.paymentStatusRepository.
			EXPECT().
			Add(
				gomock.Any(),
				userID,
				paymentPeriod,
				authorizer,
			).
			Return(nil)

		mock.userRepository.EXPECT().GetByID(gomock.Any(), gomock.Eq(userID)).Return(&domain.User{
			ID:   userID,
			Role: domain.NotMember,
		}, nil)

		mock.paymentStatusRepository.
			EXPECT().
			HasMatchingPeriod(
				gomock.Any(),
				userID,
				gomock.Eq([]int{currentPeriod, paymentPeriod}),
			).
			Return(true, nil)

		mock.userRepository.
			EXPECT().
			UpdateRole(gomock.Any(), gomock.Eq(userID), gomock.Eq(domain.Member)).
			Return(nil)

		err := mock.managementUsecase.AddPaymentStatus(
			context.Background(),
			userID,
			0,
			authorizer,
		)

		if err != nil {
			t.Fatalf("AddPaymentStatus failed: %+v", err)
		}
	})

	t.Run("member_to_member", func(t *testing.T) {
		mock, finish := initManagementMock(t)
		defer finish()

		userID := 10
		paymentPeriod := 202004
		currentPeriod := 201910
		authorizer := 11

		mock.appConfigRepository.
			EXPECT().
			GetPaymentPeriod().
			Return(paymentPeriod, nil)

		mock.appConfigRepository.
			EXPECT().
			GetCurrentPeriod().
			Return(currentPeriod, nil)

		mock.paymentStatusRepository.
			EXPECT().
			Add(
				gomock.Any(),
				userID,
				paymentPeriod,
				authorizer,
			).
			Return(nil)

		mock.userRepository.EXPECT().GetByID(gomock.Any(), gomock.Eq(userID)).Return(&domain.User{
			ID:   userID,
			Role: domain.Member,
		}, nil)

		mock.paymentStatusRepository.
			EXPECT().
			HasMatchingPeriod(
				gomock.Any(),
				userID,
				gomock.Eq([]int{currentPeriod, paymentPeriod}),
			).
			Return(true, nil)

		err := mock.managementUsecase.AddPaymentStatus(
			context.Background(),
			userID,
			0,
			authorizer,
		)

		if err != nil {
			t.Fatalf("AddPaymentStatus failed: %+v", err)
		}
	})

	// payment statusに関係ない期間でroleの再計算は行わない
	t.Run("member_to_member_not_paid", func(t *testing.T) {
		mock, finish := initManagementMock(t)
		defer finish()

		userID := 10
		paymentPeriod := 202004
		currentPeriod := 201910
		targetPeriod := 201804
		authorizer := 11

		mock.appConfigRepository.
			EXPECT().
			GetPaymentPeriod().
			Return(paymentPeriod, nil)

		mock.appConfigRepository.
			EXPECT().
			GetCurrentPeriod().
			Return(currentPeriod, nil)

		mock.paymentStatusRepository.
			EXPECT().
			Add(
				gomock.Any(),
				userID,
				targetPeriod,
				authorizer,
			).
			Return(nil)

		err := mock.managementUsecase.AddPaymentStatus(
			context.Background(),
			userID,
			targetPeriod,
			authorizer,
		)

		if err != nil {
			t.Fatalf("AddPaymentStatus failed: %+v", err)
		}
	})

	t.Run("already_paid", func(t *testing.T) {
		mock, finish := initManagementMock(t)
		defer finish()

		userID := 10
		paymentPeriod := 202004
		currentPeriod := 201910
		targetPeriod := 202004
		authorizer := 11

		mock.appConfigRepository.
			EXPECT().
			GetPaymentPeriod().
			Return(paymentPeriod, nil)

		mock.appConfigRepository.
			EXPECT().
			GetCurrentPeriod().
			Return(currentPeriod, nil)

		mock.paymentStatusRepository.
			EXPECT().
			Add(
				gomock.Any(),
				userID,
				targetPeriod,
				authorizer,
			).
			Return(domain.ErrAlreadyPaid)

		err := mock.managementUsecase.AddPaymentStatus(
			context.Background(),
			userID,
			targetPeriod,
			authorizer,
		)

		frerr := &rest.Conflict{}
		if !xerrors.As(err, &frerr) {
			t.Fatalf("AddPaymentStatus for already paid period should return rest.Conflict, but got %+v", err)
		}
	})

}

func TestDeletePaymentStatus(t *testing.T) {
	t.Run("member_to_member_deleted_paid", func(t *testing.T) {
		mock, finish := initManagementMock(t)
		defer finish()

		userID := 10
		paymentPeriod := 202004
		currentPeriod := 201910
		targetPeriod := 202004

		mock.appConfigRepository.
			EXPECT().
			GetPaymentPeriod().
			Return(paymentPeriod, nil)

		mock.appConfigRepository.
			EXPECT().
			GetCurrentPeriod().
			Return(currentPeriod, nil)

		mock.paymentStatusRepository.
			EXPECT().
			Delete(
				gomock.Any(),
				userID,
				targetPeriod,
			).
			Return(true, nil)

		mock.userRepository.EXPECT().GetByID(gomock.Any(), gomock.Eq(userID)).Return(&domain.User{
			ID:   userID,
			Role: domain.Member,
		}, nil)

		mock.paymentStatusRepository.
			EXPECT().
			HasMatchingPeriod(
				gomock.Any(),
				userID,
				gomock.Eq([]int{currentPeriod, paymentPeriod}),
			).
			Return(true, nil)

		err := mock.managementUsecase.DeletePaymentStatus(
			context.Background(),
			userID,
			0,
		)

		if err != nil {
			t.Fatalf("AddPaymentStatus failed: %+v", err)
		}
	})

	t.Run("member_to_member_deleted_not_paid", func(t *testing.T) {
		// 関係ない期間のためroleは更新されない

		mock, finish := initManagementMock(t)
		defer finish()

		userID := 10
		paymentPeriod := 202004
		currentPeriod := 201910
		targetPeriod := 201804

		mock.appConfigRepository.
			EXPECT().
			GetPaymentPeriod().
			Return(paymentPeriod, nil)

		mock.appConfigRepository.
			EXPECT().
			GetCurrentPeriod().
			Return(currentPeriod, nil)

		mock.paymentStatusRepository.
			EXPECT().
			Delete(
				gomock.Any(),
				userID,
				targetPeriod,
			).
			Return(true, nil)

		err := mock.managementUsecase.DeletePaymentStatus(
			context.Background(),
			userID,
			targetPeriod,
		)

		if err != nil {
			t.Fatalf("AddPaymentStatus failed: %+v", err)
		}
	})

	t.Run("member_to_member_not_deleted", func(t *testing.T) {
		mock, finish := initManagementMock(t)
		defer finish()

		userID := 10
		paymentPeriod := 202004
		currentPeriod := 201910
		targetPeriod := 202004

		mock.appConfigRepository.
			EXPECT().
			GetPaymentPeriod().
			Return(paymentPeriod, nil)

		mock.appConfigRepository.
			EXPECT().
			GetCurrentPeriod().
			Return(currentPeriod, nil)

		mock.paymentStatusRepository.
			EXPECT().
			Delete(
				gomock.Any(),
				userID,
				targetPeriod,
			).
			Return(false, nil)

		err := mock.managementUsecase.DeletePaymentStatus(
			context.Background(),
			userID,
			targetPeriod,
		)

		if err != nil {
			t.Fatalf("AddPaymentStatus failed: %+v", err)
		}
	})

	t.Run("member_to_not_member", func(t *testing.T) {
		mock, finish := initManagementMock(t)
		defer finish()

		userID := 10
		paymentPeriod := 202004
		currentPeriod := 201910
		targetPeriod := 202004

		mock.appConfigRepository.
			EXPECT().
			GetPaymentPeriod().
			Return(paymentPeriod, nil)

		mock.appConfigRepository.
			EXPECT().
			GetCurrentPeriod().
			Return(currentPeriod, nil)

		mock.paymentStatusRepository.
			EXPECT().
			Delete(
				gomock.Any(),
				userID,
				targetPeriod,
			).
			Return(true, nil)

		mock.userRepository.EXPECT().GetByID(gomock.Any(), gomock.Eq(userID)).Return(&domain.User{
			ID:   userID,
			Role: domain.Member,
		}, nil)

		mock.paymentStatusRepository.
			EXPECT().
			HasMatchingPeriod(
				gomock.Any(),
				userID,
				gomock.Eq([]int{currentPeriod, paymentPeriod}),
			).
			Return(false, nil)

		mock.paymentStatusRepository.
			EXPECT().
			IsFirst(
				gomock.Any(),
				userID,
				currentPeriod,
			).
			Return(false, nil)

		mock.userRepository.
			EXPECT().
			UpdateRole(
				gomock.Any(),
				userID,
				domain.NotMember,
			).
			Return(nil)

		err := mock.managementUsecase.DeletePaymentStatus(
			context.Background(),
			userID,
			targetPeriod,
		)

		if err != nil {
			t.Fatalf("AddPaymentStatus failed: %+v", err)
		}
	})

	t.Run("member_to_new_member", func(t *testing.T) {
		mock, finish := initManagementMock(t)
		defer finish()

		userID := 10
		paymentPeriod := 202004
		currentPeriod := 201910
		targetPeriod := 202004

		mock.appConfigRepository.
			EXPECT().
			GetPaymentPeriod().
			Return(paymentPeriod, nil)

		mock.appConfigRepository.
			EXPECT().
			GetCurrentPeriod().
			Return(currentPeriod, nil)

		mock.paymentStatusRepository.
			EXPECT().
			Delete(
				gomock.Any(),
				userID,
				targetPeriod,
			).
			Return(true, nil)

		mock.userRepository.EXPECT().GetByID(gomock.Any(), gomock.Eq(userID)).Return(&domain.User{
			ID:   userID,
			Role: domain.Member,
		}, nil)

		mock.paymentStatusRepository.
			EXPECT().
			HasMatchingPeriod(
				gomock.Any(),
				userID,
				gomock.Eq([]int{currentPeriod, paymentPeriod}),
			).
			Return(false, nil)

		mock.paymentStatusRepository.
			EXPECT().
			IsFirst(
				gomock.Any(),
				userID,
				currentPeriod,
			).
			Return(true, nil)

		mock.userRepository.
			EXPECT().
			UpdateRole(
				gomock.Any(),
				userID,
				domain.NewMember,
			).
			Return(nil)

		err := mock.managementUsecase.DeletePaymentStatus(
			context.Background(),
			userID,
			targetPeriod,
		)

		if err != nil {
			t.Fatalf("AddPaymentStatus failed: %+v", err)
		}
	})
}
