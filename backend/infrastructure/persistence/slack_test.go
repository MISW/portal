// +build use_external_db

package persistence_test

import (
	"context"
	"testing"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/testutil"
	"github.com/MISW/Portal/backend/mock/domain/repository"
)

var (
	usersToBeInvited = []*domain.User{
		{
			Email:                 "mischan@example.com",
			Generation:            54,
			Sex:                   domain.Female,
			Role:                  domain.Member,
			SlackInvitationStatus: domain.Never,
		},
		{
			Email:                 "mischan2@example.com",
			Generation:            54,
			Sex:                   domain.Female,
			Role:                  domain.Admin,
			SlackInvitationStatus: domain.Never,
		},
	}

	usersToBeNotInvited = []*domain.User{
		{
			Email:                 "mischan3@example.com",
			Generation:            54,
			Sex:                   domain.Female,
			Role:                  domain.NotMember,
			SlackInvitationStatus: domain.Never,
		},
		{
			Email:                 "mischan5@example.com",
			Generation:            54,
			Sex:                   domain.Female,
			Role:                  domain.Member,
			SlackInvitationStatus: domain.Invited,
		},
		{
			Email:                 "mischan6@example.com",
			Generation:            54,
			Sex:                   domain.Female,
			Role:                  domain.Member,
			SlackInvitationStatus: domain.Never,
			SlackID:               "slack id",
		},
	}
)

func insertTestSlackData(t *testing.T, up repository.UserRepository) (invited map[int]struct{}, uninvited map[int]domain.SlackInvitationStatus) {
	t.Helper()

	invited, uninvited = map[int]struct{}{}, map[int]domain.SlackInvitationStatus{}

	for i := range usersToBeInvited {
		id, err := up.Insert(context.Background(), usersToBeInvited[i])

		if err != nil {
			t.Errorf("inserting a new user to db failed: %+v", err)
		}

		invited[id] = struct{}{}
	}

	for i := range usersToBeNotInvited {
		id, err := up.Insert(context.Background(), usersToBeNotInvited[i])

		if err != nil {
			t.Errorf("inserting a new user to db failed: %+v", err)
		}

		uninvited[id] = usersToBeNotInvited[i].SlackInvitationStatus
	}

	return
}

func TestUpdateSlackID(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	sp := persistence.NewSlackPersistence(conn)
	up := persistence.NewUserPersistence(conn)

	id := insertTestUserData(t, up)

	updatedSlackID := "SLACKID"
	err := sp.UpdateSlackID(context.Background(), id, updatedSlackID)

	if err != nil {
		t.Errorf("failed to update slack id: %+v", err)
	}

	user, err := up.GetByID(context.Background(), id)

	if err != nil {
		t.Errorf("failed to get user: %+v", err)
	}

	if user.SlackID != updatedSlackID {
		t.Errorf("slack id is not updated: %s(expected: %s)", user.SlackID, updatedSlackID)
	}
}

func TestMarkUninvitedAsPending(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	sp := persistence.NewSlackPersistence(conn)
	up := persistence.NewUserPersistence(conn)

	invited, uninvited := insertTestSlackData(t, up)

	ctx := context.Background()

	if err := sp.MarkUninvitedAsPending(ctx); err != nil {
		t.Errorf("failed to mark members: %+v", err)
	}

	t.Run("invited", func(t *testing.T) {
		users, err := up.List(ctx)

		if err != nil {
			t.Errorf("failed to list all users: %+v", err)
		}

		for i := range users {
			if _, ok := invited[users[i].ID]; ok {
				if users[i].SlackInvitationStatus != domain.Pending {
					t.Errorf("members to be invited should have pending status, but have %s", users[i].SlackInvitationStatus)
				}
			} else {
				if users[i].SlackInvitationStatus != uninvited[users[i].ID] {
					t.Errorf("members to be invited should have the same invitation status(expected: %s, actual: %s)", uninvited[users[i].ID], users[i].SlackInvitationStatus)
				}
			}
		}
	})
}

func TestGetPending(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	sp := persistence.NewSlackPersistence(conn)
	up := persistence.NewUserPersistence(conn)

	invited, _ := insertTestSlackData(t, up)

	ctx := context.Background()

	if err := sp.MarkUninvitedAsPending(ctx); err != nil {
		t.Errorf("failed to mark uninvited as pending: %+v", err)
	}

	user, err := sp.GetPending(ctx)

	if err != nil {
		t.Errorf("get pending failed: %+v", err)
	}

	for id := range invited {
		if user.ID == id {
			// OK

			return
		}
	}

	t.Errorf("invalid one is selected: %v", user)
}

func TestMarkAsInvited(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	sp := persistence.NewSlackPersistence(conn)
	up := persistence.NewUserPersistence(conn)

	insertTestSlackData(t, up)

	ctx := context.Background()

	if err := sp.MarkUninvitedAsPending(ctx); err != nil {
		t.Errorf("failed to mark uninvited as pending: %+v", err)
	}

	user, err := sp.GetPending(ctx)

	if err != nil {
		t.Errorf("get pending failed: %+v", err)
	}

	err = sp.MarkAsInvited(ctx, user.ID)

	if err != nil {
		t.Errorf("failed to mark as invited: %+v", err)
	}

	user, err = up.GetByID(ctx, user.ID)

	if err != nil {
		t.Errorf("failed to find user: %+v", err)
	}

	if user.SlackInvitationStatus != domain.Invited {
		t.Errorf("invitation status is not upted: %s", user.SlackInvitationStatus)
	}
}
