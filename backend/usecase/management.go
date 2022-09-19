package usecase

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/MISW/Portal/backend/internal/email"
	"github.com/MISW/Portal/backend/internal/rest"
	"go.uber.org/dig"

	"golang.org/x/xerrors"

	"github.com/MISW/Portal/backend/domain/repository"

	"github.com/MISW/Portal/backend/domain"
)

// ManagementUsecase - 管理者が利用する処理の一覧
type ManagementUsecase interface {
	// ListUsers - 全てのユーザを一覧表示する
	ListUsers(ctx context.Context, period int) ([]*domain.UserPaymentStatus, error)

	// AuthorizeTransaction - 支払い済登録申請を許可する
	AuthorizeTransaction(ctx context.Context, token string, authorizer int) error

	// AddPaymentStatus - 支払い情報を追加(QRコード経由せず)
	AddPaymentStatus(ctx context.Context, userID, period, authorizer int) error

	// GetPaymentStatus - 特定の支払い情報を取得する
	GetPaymentStatus(ctx context.Context, userID, period int) (*domain.PaymentStatus, error)

	// DeletePaymentStatus - 支払い情報を追加(QRコード経由せず)
	DeletePaymentStatus(ctx context.Context, userID, period int) error

	// GetPaymentStatusesForUser - あるユーザの支払い情報一覧を取得する
	GetPaymentStatusesForUser(ctx context.Context, userID int) ([]*domain.PaymentStatus, error)

	// GetUser - ユーザ情報を取得
	GetUser(ctx context.Context, userID int) (*domain.UserPaymentStatus, error)

	// UpdateUser - ユーザ情報を更新(制限なし)
	UpdateUser(ctx context.Context, user *domain.User) error

	// UpdateRole - ユーザのroleを変更
	UpdateRole(ctx context.Context, userID int, role domain.RoleType) error

	// RemindPayment - 未払い会員に催促メールを送る
	RemindPayment(ctx context.Context, filter []int) error
}

type ManagementUsecaseParams struct {
	dig.In

	UserRepository               repository.UserRepository
	PaymentStatusRepository      repository.PaymentStatusRepository
	PaymentTransactionRepository repository.PaymentTransactionRepository
	AppConfigRepository          repository.AppConfigRepository
	UserRoleRepository           repository.UserRoleRepository
	EmailSender                  email.Sender
}

type managementUsecase struct {
	*ManagementUsecaseParams
}

// NewManagementUsecase - management usecaseの初期化
func NewManagementUsecase(param ManagementUsecaseParams) ManagementUsecase {
	return &managementUsecase{
		ManagementUsecaseParams: &param,
	}
}

var _ ManagementUsecase = &managementUsecase{}

func (mu *managementUsecase) ListUsers(ctx context.Context, period int) ([]*domain.UserPaymentStatus, error) {
	users, err := mu.UserRepository.List(ctx)

	if err != nil {
		return nil, xerrors.Errorf("failed to list users: %w", err)
	}

	if period == 0 {
		period, err = mu.AppConfigRepository.GetPaymentPeriod()

		if err != nil {
			return nil, xerrors.Errorf("failed to get current period from app config: %w", err)
		}
	}

	pss, err := mu.PaymentStatusRepository.ListUsersForPeriod(ctx, period)

	if err != nil {
		return nil, xerrors.Errorf("failed to list users for period(%d): %w", period, err)
	}

	psmap := map[int]*domain.PaymentStatus{}
	for i := range pss {
		psmap[pss[i].UserID] = pss[i]
	}

	uts := make([]*domain.UserPaymentStatus, len(users))

	for i := range uts {
		ps := psmap[users[i].ID]

		uts[i] = &domain.UserPaymentStatus{
			User:          *users[i],
			PaymentStatus: ps,
		}
	}

	return uts, nil
}

func (mu *managementUsecase) AuthorizeTransaction(ctx context.Context, token string, authorizer int) error {
	transaction, err := mu.PaymentTransactionRepository.Get(ctx, token)

	if err != nil {
		if errors.Is(err, domain.ErrNoPaymentTransaction) {
			return rest.NewBadRequest("無効なトークンです")
		}

		return xerrors.Errorf("failed to get payment transaction: %w", err)
	}

	if time.Now().After(transaction.ExpiredAt) {
		return rest.NewBadRequest("無効なトークンです")
	}

	err = mu.AddPaymentStatus(ctx, transaction.UserID, 0, authorizer)

	var frerr rest.ErrorResponse
	if errors.As(err, &frerr) {
		return frerr
	}

	if err != nil {
		return xerrors.Errorf("failed to add payment status for user(%d): %w", transaction.UserID, err)
	}

	if err := mu.PaymentTransactionRepository.Delete(ctx, token); err != nil {
		return xerrors.Errorf("failed to delete payment transaction token: %w", err)
	}

	return nil
}

func (mu *managementUsecase) AddPaymentStatus(ctx context.Context, userID, period, authorizer int) error {
	paymentPeriod, err := mu.AppConfigRepository.GetPaymentPeriod()

	if err != nil {
		return xerrors.Errorf("failed to get payment period from app config: %w", err)
	}

	currentPeriod, err := mu.AppConfigRepository.GetCurrentPeriod()

	if err != nil {
		return xerrors.Errorf("failed to get current period from app config: %w", err)
	}

	if period == 0 {
		period = paymentPeriod
	}

	if err := mu.PaymentStatusRepository.Add(ctx, userID, period, authorizer); err != nil {
		if errors.Is(err, domain.ErrAlreadyPaid) {
			return rest.NewConflict("すでに支払い済みです")
		}

		return xerrors.Errorf("failed to ad payment status for (userid: %d, period: %d, authorizer: %d)", userID, period, authorizer)
	}

	if period != currentPeriod && period != paymentPeriod {
		return nil
	}

	if err := mu.UserRoleRepository.UpdateWithRule(ctx, userID, currentPeriod, paymentPeriod); err != nil {
		return xerrors.Errorf("failed to update role for user(%d) automatically: %w", userID, err)
	}

	// メール送信: これによって自分が入会できたことを確認できる。
	// TODO1: メール送信に失敗した場合、手動で再送信する必要がある。DBなどにメール送信失敗者を保存しておいて、定期的に送信再チャレンジした方が良さそう。
	// TODO2: いずれは領収証として支払い金額も載せた方がいいかもしれない。
	user, err := mu.UserRepository.GetByID(ctx, userID)
	if err != nil {
		return xerrors.Errorf("failed to send email because no user(%d) found: %w", userID, err)
	}

	subject, body, err := mu.AppConfigRepository.GetEmailTemplate(domain.PaymentReceipt)
	if err != nil {
		return xerrors.Errorf("failed to send email because failed to get email template for payment reminder: %w", err)
	}

	subject, body, err = email.GenerateEmailFromTemplate(subject, body, map[string]interface{}{
		"User": user,
	})
	if err != nil {
		return xerrors.Errorf("failed to send email: %w", err)
	}

	if err := mu.EmailSender.Send(user.Email, subject, body); err != nil {
		return xerrors.Errorf("failed to send email: %w", err)
	}

	return nil
}

func (mu *managementUsecase) DeletePaymentStatus(ctx context.Context, userID, period int) error {
	paymentPeriod, err := mu.AppConfigRepository.GetPaymentPeriod()

	if err != nil {
		return xerrors.Errorf("failed to get payment period from app config: %w", err)
	}

	currentPeriod, err := mu.AppConfigRepository.GetCurrentPeriod()

	if err != nil {
		return xerrors.Errorf("failed to get current period from app config: %w", err)
	}

	if period == 0 {
		period = paymentPeriod
	}

	deleted, err := mu.PaymentStatusRepository.Delete(ctx, userID, period)

	if err != nil {
		return xerrors.Errorf("failed to delete payment status: %w", err)
	}

	if !deleted {
		return nil
	}

	if period != currentPeriod &&
		period != paymentPeriod {
		return nil
	}

	if err := mu.UserRoleRepository.UpdateWithRule(ctx, userID, currentPeriod, paymentPeriod); err != nil {
		return xerrors.Errorf("failed to update role for user(%d) automatically: %w", userID, err)
	}

	return nil
}

func (mu *managementUsecase) GetPaymentStatus(ctx context.Context, userID, period int) (*domain.PaymentStatus, error) {
	if period == 0 {
		paymentPeriod, err := mu.AppConfigRepository.GetPaymentPeriod()

		if err != nil {
			return nil, xerrors.Errorf("failed to get payment period from app config: %w", err)
		}

		period = paymentPeriod
	}

	ps, err := mu.PaymentStatusRepository.Get(ctx, userID, period)

	if errors.Is(err, domain.ErrNoPaymentStatus) {
		return nil, rest.NewNotFound("存在しない支払い情報です")
	}

	if err != nil {
		return nil, xerrors.Errorf("failed to get payment status(userid: %d, period: %d): %w", userID, period, err)
	}

	return ps, nil
}

func (mu *managementUsecase) GetPaymentStatusesForUser(ctx context.Context, userID int) ([]*domain.PaymentStatus, error) {
	res, err := mu.PaymentStatusRepository.ListPeriodsForUser(ctx, userID)

	if err != nil {
		return nil, xerrors.Errorf("failed to list payment statuses for user: %w", err)
	}

	return res, nil
}

func (mu *managementUsecase) GetUser(ctx context.Context, userID int) (*domain.UserPaymentStatus, error) {
	user, err := mu.getUser(ctx, userID)

	if err != nil {
		return nil, xerrors.Errorf("failed to get user by id(%d): %w", userID, err)
	}
	ps, err := mu.GetPaymentStatus(ctx, userID, 0)

	var notFound *rest.NotFound
	if errors.As(err, &notFound) {
		ps = nil
	} else if err != nil {
		return nil, xerrors.Errorf("failed to get payment status for user(%d): %w", userID, err)
	}

	return &domain.UserPaymentStatus{
		User:          *user,
		PaymentStatus: ps,
	}, nil
}

func (mu *managementUsecase) getUser(ctx context.Context, userID int) (*domain.User, error) {
	user, err := mu.UserRepository.GetByID(ctx, userID)

	if err == domain.ErrNoUser {
		return nil, rest.NewNotFound("user not found")
	}

	if err != nil {
		return nil, xerrors.Errorf("failed to find user by id(%d): %w", userID, err)
	}

	return user, nil
}

func (mu *managementUsecase) UpdateUser(ctx context.Context, user *domain.User) error {
	if err := user.Validate(); err != nil {
		return err
	}

	err := mu.UserRepository.Update(ctx, user)

	if err != nil {
		return xerrors.Errorf("failed to find user by id(%d): %w", user.ID, err)
	}

	return nil
}

func (mu *managementUsecase) UpdateRole(ctx context.Context, userID int, role domain.RoleType) error {
	if !role.Validate() {
		return rest.NewBadRequest("存在しないロールが指定されています")
	}

	err := mu.UserRoleRepository.Update(ctx, userID, role)

	if err != nil {
		return xerrors.Errorf("failed to find user by id(%d): %w", userID, err)
	}

	return nil
}

func (mu *managementUsecase) RemindPayment(ctx context.Context, filter []int) error {
	period, err := mu.AppConfigRepository.GetPaymentPeriod()

	if err != nil {
		return xerrors.Errorf("failed to get payment period: %w", err)
	}

	unpaid, err := mu.PaymentStatusRepository.ListUnpaidMembers(ctx, period)

	if err != nil {
		return xerrors.Errorf("failed to list unpaid members: %w", err)
	}

	subject, body, err := mu.AppConfigRepository.GetEmailTemplate(domain.PaymentReminder)

	if err != nil {
		return xerrors.Errorf("failed to get email template for payment reminder: %w", err)
	}

	filterSet := map[int]struct{}{}
	for i := range filter {
		filterSet[filter[i]] = struct{}{}
	}

	failed := make([]string, 0, len(unpaid))
	for i := range unpaid {
		if len(filter) != 0 {
			_, ok := filterSet[unpaid[i].ID]

			if !ok {
				continue
			}
		}

		subject, body, err := email.GenerateEmailFromTemplate(subject, body, map[string]interface{}{
			"User": unpaid[i],
		})

		if err != nil {
			return err
		}

		if err := mu.EmailSender.Send(unpaid[i].Email, subject, body); err != nil {
			failed = append(failed, fmt.Sprintf("%d(%s): %v", unpaid[i].ID, unpaid[i].Email, err))
		}
	}

	if len(failed) == 0 {
		return nil
	}

	return rest.NewInternalServerError(strings.Join(failed, "\n"))
}
