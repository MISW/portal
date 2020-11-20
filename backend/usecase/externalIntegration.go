package usecase

import (
	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/rest"
	"golang.org/x/xerrors"
)

func NewExternalIntegrationUsecase(repo repository.ExternalIntegrationRepository) ExternalIntegrationUsecase {
	return &externalIntegrationUsecase{
		repo: repo,
	}
}

// ExternalIntegrationUsecase - 外部連携サービスのための
type ExternalIntegrationUsecase interface {
	GetUserRoleFromSlackID(slackID string) (string, error)
}

type externalIntegrationUsecase struct {
	repo repository.ExternalIntegrationRepository
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
