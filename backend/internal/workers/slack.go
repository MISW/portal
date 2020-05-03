package workers

import (
	"context"
	"log"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/slack"
	"golang.org/x/xerrors"
)

// NewSlackInviter -
func NewSlackInviter(client *slack.Client, slackRepository repository.SlackRepository) Worker {
	return &slackInviter{
		client:          client,
		trigger:         make(chan struct{}, 1),
		slackRepository: slackRepository,
	}
}

type slackInviter struct {
	client          *slack.Client
	slackRepository repository.SlackRepository
	trigger         chan struct{}
}

var _ Worker = &slackInviter{}

func (si *slackInviter) inviteToSlack(handle, email string) error {
	// Not inheriting context
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := si.client.InviteToTeam(ctx, handle, "", email); err != nil {
		return xerrors.Errorf("failed to invite to slack: %w", err)
	}

	return nil
}

// findPending returns true if there is no pending or an error happened
func (si *slackInviter) findPending(ctx context.Context) bool {
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

	if err := si.inviteToSlack(user.Handle, user.Email); err != nil {
		return true
	}

	if err := si.slackRepository.MarkAsInvited(ctx, user.ID); err != nil {
		log.Printf("failed to mark user(%d) as invited: %+v", user.ID, err)

		return true
	}

	return false
}

func (si *slackInviter) Start(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("slack inviter stopped: ", ctx.Err())

			return
		case <-ticker.C:
		case <-si.trigger:
		}

		for {
			if si.findPending(ctx) {
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
