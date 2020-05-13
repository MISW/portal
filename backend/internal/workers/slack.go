package workers

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/email"
	"github.com/MISW/Portal/backend/internal/slack"
	"golang.org/x/xerrors"
)

// NewSlackInviter -
func NewSlackInviter(client *slack.Client, slackRepository repository.SlackRepository, appConfigRpoeisotry repository.AppConfigRepository, sender email.Sender) Worker {
	return &slackInviter{
		client:              client,
		trigger:             make(chan struct{}, 1),
		slackRepository:     slackRepository,
		sender:              sender,
		appConfigRpoeisotry: appConfigRpoeisotry,
	}
}

type slackInviter struct {
	client              *slack.Client
	slackRepository     repository.SlackRepository
	appConfigRpoeisotry repository.AppConfigRepository
	sender              email.Sender
	trigger             chan struct{}
}

var _ Worker = &slackInviter{}

func (si *slackInviter) inviteToSlack(user *domain.User, subjectTemplate, bodyTemplate string) error {
	// Not inheriting context
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	err := si.client.InviteToTeam(ctx, user.Handle, "", user.Email)

	if err != nil {
		if strings.Contains(err.Error(), "user_disabled") ||
			strings.Contains(err.Error(), "already_in_team") ||
			strings.Contains(err.Error(), "already_in_team_invited_user") {
			log.Printf("email(%s) is already used", user.Email)

			return nil
		}

		if strings.Contains(err.Error(), "invalid_email") {
			log.Printf("email(%s) is invalid", user.Email)

			return nil
		}

		return xerrors.Errorf("failed to invite to slack: %w", err)
	}

	subject, body, err := email.GenerateEmailFromTemplate(subjectTemplate, bodyTemplate, map[string]interface{}{
		"User": user,
	})

	if err != nil {
		log.Printf("failed to generate email from template: %+v", err)
	} else if err := si.sender.Send(user.Email, subject, body); err != nil {
		log.Printf("failed to send email to verify the email address(%s): %+v", user.Email, err)
	}

	return nil
}

// findPending returns true if there is no pending or an error happened
func (si *slackInviter) findPending(ctx context.Context, subjectTemplate, bodyTemplate string) bool {
	user, err := si.slackRepository.GetPending(ctx)

	if xerrors.Is(err, domain.ErrNoUser) {
		return true
	}

	if err != nil {
		log.Printf("failed to get pending user: %+v", err)

		return true
	}

	if user.SlackInvitationStatus != domain.Pending {
		return false // maybe due to temporal data inconsistency
	}

	if err := si.inviteToSlack(user, subjectTemplate, bodyTemplate); err != nil {
		log.Printf("failed to invite to slack(%d, %s): %+v", user.ID, user.Email, err)

		return true
	}

	if err := si.slackRepository.MarkAsInvited(ctx, user.ID); err != nil {
		log.Printf("failed to mark user(%d) as invited: %+v", user.ID, err)

		return true
	}

	return false
}

func (si *slackInviter) Start(ctx context.Context) {
	log.Println("slack inviter started")
	defer log.Println("slack inviter stopped: ", ctx.Err())

	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():

			return
		case <-ticker.C:
		case <-si.trigger:
		}

		subjectTemplate, bodyTemplate, err := si.appConfigRpoeisotry.GetEmailTemplate(domain.SlackInvitation)

		if err != nil {
			log.Printf("failed to get an email template for slack invitation: %+v", err)

			continue
		}

		for {
			if si.findPending(ctx, subjectTemplate, bodyTemplate) {
				break
			}
		}
	}
}

func (si *slackInviter) Trigger() {
	select {
	case si.trigger <- struct{}{}:
	default:
	}
}
