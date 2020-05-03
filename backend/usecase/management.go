package usecase

import (
	"context"
	"time"

	"github.com/MISW/Portal/backend/internal/rest"
	"github.com/MISW/Portal/backend/internal/workers"
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

	// InviteToSlack - Slackに招待されていないメンバーをSlackに招待する(非同期)
	InviteToSlack(ctx context.Context) error
}

type ManagementUsecaseParams struct {
	dig.In

	UserRepository               repository.UserRepository
	PaymentStatusRepository      repository.PaymentStatusRepository
	PaymentTransactionRepository repository.PaymentTransactionRepository
	AppConfigRepository          repository.AppConfigRepository
	SlackRepository              repository.SlackRepository
	SlackInviter                 workers.Worker `name:"slack"`
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
		ps, _ := psmap[users[i].ID]

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
		if xerrors.Is(err, domain.ErrNoPaymentTransaction) {
			return rest.NewBadRequest("無効なトークンです")
		}

		return xerrors.Errorf("failed to get payment transaction: %w", err)
	}

	if time.Now().After(transaction.ExpiredAt) {
		return rest.NewBadRequest("無効なトークンです")
	}

	err = mu.AddPaymentStatus(ctx, transaction.UserID, 0, authorizer)

	var frerr rest.ErrorResponse
	if xerrors.As(err, &frerr) {
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

// updateRole - roleを再計算して設定する
// currentRole、currentPeriod、paymentPeriodは既に取得済みの場合キャッシュとして利用する目的のため、取得済みでない場合は""または0を渡す
func (mu *managementUsecase) updateRole(
	ctx context.Context,
	userID int,
	currentRole domain.RoleType,
	currentPeriod, paymentPeriod int,
) error {
	var err error

	if len(currentRole) == 0 {
		user, err := mu.getUser(ctx, userID)

		if err != nil {
			return xerrors.Errorf("failed to retrieve user info: %w", err)
		}

		currentRole = user.Role
	}

	if currentPeriod == 0 {
		currentPeriod, err = mu.AppConfigRepository.GetCurrentPeriod()

		if err != nil {
			return xerrors.Errorf("failed to get current period: %w", err)
		}
	}

	if paymentPeriod == 0 {
		paymentPeriod, err = mu.AppConfigRepository.GetPaymentPeriod()

		if err != nil {
			return xerrors.Errorf("failed to get payment period: %w", err)
		}
	}

	matched, err := mu.PaymentStatusRepository.HasMatchingPeriod(ctx, userID, []int{
		currentPeriod,
		paymentPeriod,
	})

	prevPaid := matched

	if !matched {
		// currentPeriod <= paymentPeriodであるから、currentPeriodより前に支払いがあるかどうかで以前加入していたか判定できる
		isFirst, err := mu.PaymentStatusRepository.IsFirst(ctx, userID, currentPeriod)

		if err != nil {
			return xerrors.Errorf("failed to check payment status before current period: %w", err)
		}

		prevPaid = !isFirst
	}

	newRole := currentRole.GetNewRole(matched, prevPaid)

	if newRole != currentRole {
		if err := mu.UserRepository.UpdateRole(ctx, userID, newRole); err != nil {
			return xerrors.Errorf("failed to update role: %w", err)
		}
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
		if xerrors.Is(err, domain.ErrAlreadyPaid) {
			return rest.NewConflict("すでに支払い済みです")
		}

		return xerrors.Errorf("failed to ad payment status for (userid: %d, period: %d, authorizer: %d)", userID, period, authorizer)
	}

	if period != currentPeriod && period != paymentPeriod {
		return nil
	}

	err = mu.updateRole(
		ctx,
		userID,
		"",
		currentPeriod,
		paymentPeriod,
	)

	if err != nil {
		return xerrors.Errorf("failed to update role: %w", err)
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

	err = mu.updateRole(
		ctx,
		userID,
		"",
		currentPeriod,
		paymentPeriod,
	)

	if err != nil {
		return xerrors.Errorf("failed to update role: %w", err)
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

	if xerrors.Is(err, domain.ErrNoPaymentStatus) {
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
	if xerrors.As(err, &notFound) {
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

	err := mu.UserRepository.UpdateRole(ctx, userID, role)

	if err != nil {
		return xerrors.Errorf("failed to find user by id(%d): %w", userID, err)
	}

	return nil
}

func (mu *managementUsecase) InviteToSlack(ctx context.Context) error {
	if err := mu.SlackRepository.MarkUninvitedAsPending(ctx); err != nil {
		return xerrors.Errorf("failed to mark uninvited members as pending: %w", err)
	}

	mu.SlackInviter.Trigger()

	return nil
}
