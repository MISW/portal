package usecase

import (
	"context"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/rest"
	"golang.org/x/xerrors"
)

func NewExternalIntegrationUsecase(repo repository.ExternalIntegrationRepository, userRepo repository.UserRepository) ExternalIntegrationUsecase {
	return &externalIntegrationUsecase{
		repo: repo,
		userRepo: userRepo,
	}
}

// ExternalIntegrationUsecase - 外部連携サービスのための
type ExternalIntegrationUsecase interface {
	GetUserRoleFromSlackID(slackID string) (string, error)
	GetAllMemberRolesBySlackID(ctx context.Context) (map[string] string, error)
}

type externalIntegrationUsecase struct {
	repo repository.ExternalIntegrationRepository
	userRepo repository.UserRepository
}

var _ ExternalIntegrationUsecase = &externalIntegrationUsecase{}

func (u *externalIntegrationUsecase) GetUserRoleFromSlackID(slackID string) (string, error) {
	role, err := u.repo.GetUserRoleFromSlackID(slackID)

	if xerrors.Is(err, domain.ErrNoUser) {
		return "", rest.NewNotFound("no such user")
	}

	if err != nil {
		return "", xerrors.Errorf("failed to get user role from slack id: %w", err)
	}

	return role, nil
}

func (u *externalIntegrationUsecase) GetAllMemberRolesBySlackID(ctx context.Context) (map[string] string, error) {
	users, err := u.userRepo.List(ctx)

	if err != nil {
		return nil, xerrors.Errorf("failed to get user roles: %w", err)
	}

	roles := map[string]string{}
	for _, user := range users {
		if user.SlackID == "" {
			continue
		}
		roles[user.SlackID] = string(user.Role)
	}

	return roles, nil
}
