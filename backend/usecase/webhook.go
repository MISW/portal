package usecase

import (
	"context"
	"log"

	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/slack"
	"golang.org/x/xerrors"
)

type WebhookUsecase interface {
	NewUser(ctx context.Context, email, slackID string) error
}

type webhookUsecase struct {
	userRepository repository.UserRepository
	slackClient    *slack.Client
}

var _ WebhookUsecase = &webhookUsecase{}

// NewWebhookUsecase - Webhookの処理を行うやつを初期化
func NewWebhookUsecase(slackClient *slack.Client, userRepository repository.UserRepository) WebhookUsecase {
	return &webhookUsecase{
		userRepository: userRepository,
		slackClient:    slackClient,
	}
}

func (wu *webhookUsecase) NewUser(ctx context.Context, email, slackID string) error {
	var err error
	if len(email) == 0 {
		email, err = wu.slackClient.GetUserProfileByID(ctx, slackID)

		if err != nil {
			return xerrors.Errorf("failed to get email from id in Slack(%s): %w", slackID, err)
		}
	}

	user, err := wu.userRepository.GetByEmail(ctx, email)

	if err != nil {
		return xerrors.Errorf("unknown email address: %w", err)
	}

	if len(user.SlackID) != 0 {
		log.Printf("WARNING: the user(%d, %s) has been already registered for slack: %s", user.ID, user.Email, user.SlackID)

		return nil
	}

	if err := wu.userRepository.UpdateSlackID(ctx, user.ID, slackID); err != nil {
		return xerrors.Errorf("failed to update slack id for user(%d) as slack id(%s): %w", user.ID, slackID, err)
	}

	return nil
}
