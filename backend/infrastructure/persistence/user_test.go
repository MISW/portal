// +build use_external_db

package persistence_test

import (
	"context"
	"testing"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/testutil"
	"github.com/google/go-cmp/cmp"
)

var (
	userTemplate = &domain.User{
		Email:      "mischan@example.com",
		Generation: 53,
		Name:       "みす ちゃん",
		Kana:       "ミス チャン",
		Handle:     "mischan",
		Sex:        domain.Male,
		University: domain.University{
			Name:       "早稲田大学",
			Department: "基幹理工学部",
			Subject:    "情報理工学科",
		},
		StudentID:             "1W180000-0",
		EmergencyPhoneNumber:  "0120117117",
		OtherCircles:          "WCE",
		Workshops:             []string{"Programming", "CG", "MIDI"},
		Squads:                []string{"Web", "Webデザイン"},
		Role:                  domain.Admin,
		SlackInvitationStatus: domain.Invited,
		SlackID:               "UAJXXXXXX",
		DiscordID:             "mischan#0123",
	}

	userTemplate2 = &domain.User{
		Email:      "mischan2@example.com",
		Generation: 54,
		Name:       "みす ちゃん2号",
		Kana:       "ミス チャンニゴウ",
		Handle:     "mischan2",
		Sex:        domain.Female,
		University: domain.University{
			Name:       "早稲田大学",
			Department: "基幹理工学部",
			Subject:    "情報通信学科",
		},
		StudentID:             "1W180000-1",
		EmergencyPhoneNumber:  "0120117117",
		OtherCircles:          "WCE",
		Workshops:             []string{"Programming", "CG", "MIDI"},
		Squads:                []string{"Web", "Webデザイン"},
		Role:                  domain.Admin,
		SlackInvitationStatus: domain.Invited,
		SlackID:               "UAJXXXXXX",
		DiscordID:             "mischan#0123",
	}
)

func insertTestUserData(t *testing.T, up repository.UserRepository) int {
	t.Helper()

	id, err := up.Insert(context.Background(), userTemplate)

	if err != nil {
		t.Fatalf("inserting a new user to db failed: %+v", err)
	}

	return id
}

func compareUser(t *testing.T, expected, actual *domain.User) {
	e := *expected
	expected = &e

	if actual.CreatedAt.Before(time.Now().Add(-1*time.Minute)) || actual.CreatedAt.After(time.Now()) {
		t.Fatalf("created_at is invalid: %+v", actual.CreatedAt)
	}
	if actual.UpdatedAt.Before(time.Now().Add(-1*time.Minute)) || actual.UpdatedAt.After(time.Now()) {
		t.Fatalf("updated_at is invalid: %+v", actual.UpdatedAt)
	}

	expected.CreatedAt = actual.CreatedAt
	expected.UpdatedAt = actual.UpdatedAt
	expected.ID = actual.ID

	if diff := cmp.Diff(expected, actual); diff != "" {
		t.Fatalf("users differ: %v", diff)
	}
}

func TestInsert(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	up := persistence.NewUserPersistence(conn)

	id := insertTestUserData(t, up)

	if id == 0 {
		t.Fatalf("id shoule not be 0, but %d", id)
	}

	_, err := up.Insert(context.Background(), userTemplate)

	if err != domain.ErrEmailConflicts {
		t.Fatalf("the second insert should return ErrEmailConflicts: %+v", err)
	}
}

func TestGet(t *testing.T) {
	t.Run("get_by_id", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		user, err := up.GetByID(context.Background(), id)

		if err != nil {
			t.Fatalf("failed to get user by id: %+v", err)
		}

		compareUser(t, userTemplate, user)
	})

	t.Run("get_by_email", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		insertTestUserData(t, up)

		user, err := up.GetByEmail(context.Background(), userTemplate.Email)

		if err != nil {
			t.Fatalf("failed to get user by id: %+v", err)
		}

		compareUser(t, userTemplate, user)
	})

	t.Run("get_by_slack", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		insertTestUserData(t, up)

		user, err := up.GetBySlackID(context.Background(), userTemplate.SlackID)

		if err != nil {
			t.Fatalf("failed to get user by id: %+v", err)
		}

		compareUser(t, userTemplate, user)
	})

}

func TestList(t *testing.T) {
	t.Run("normal", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		insertTestUserData(t, up)

		users, err := up.List(context.Background())

		if err != nil {
			t.Fatalf("failed to list users: %+v", err)
		}

		if expected := 1; len(users) != expected {
			t.Fatalf("list should return %d users, but returned %d", expected, len(users))
		}

		compareUser(t, userTemplate, users[0])
	})

	t.Run("by_id_normal", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		users, err := up.ListByID(context.Background(), []int{id})

		if err != nil {
			t.Fatalf("failed to list users: %+v", err)
		}

		if expected := 1; len(users) != expected {
			t.Fatalf("list should return %d users, but returned %d", expected, len(users))
		}

		compareUser(t, userTemplate, users[0])
	})

	t.Run("by_no_id", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		insertTestUserData(t, up)

		users, err := up.ListByID(context.Background(), []int{})

		if err != nil {
			t.Fatalf("failed to list users: %+v", err)
		}

		if expected := 0; len(users) != expected {
			t.Fatalf("list should return %d users, but returned %d", expected, len(users))
		}
	})

}

func TestUpdate(t *testing.T) {
	t.Run("normal", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		tmp2 := *userTemplate2

		tmp2.ID = id

		err := up.Update(context.Background(), &tmp2)

		if err != nil {
			t.Fatalf("failed to update user: %+v", err)
		}

		user, err := up.GetByID(context.Background(), id)

		if err != nil {
			t.Fatalf("failed to get user: %+v", err)
		}

		compareUser(t, &tmp2, user)
	})

	t.Run("role", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		updatedRole := domain.NotMember
		err := up.UpdateRole(context.Background(), id, updatedRole)

		if err != nil {
			t.Fatalf("failed to update role: %+v", err)
		}

		user, err := up.GetByID(context.Background(), id)

		if err != nil {
			t.Fatalf("failed to get user: %+v", err)
		}

		if user.Role != updatedRole {
			t.Fatalf("role is not updated: %s(expected: %s)", user.Role, updatedRole)
		}
	})

	t.Run("slack id", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		updatedSlackID := "SLACKID"
		err := up.UpdateSlackID(context.Background(), id, updatedSlackID)

		if err != nil {
			t.Fatalf("failed to update slack id: %+v", err)
		}

		user, err := up.GetByID(context.Background(), id)

		if err != nil {
			t.Fatalf("failed to get user: %+v", err)
		}

		if user.SlackID != updatedSlackID {
			t.Fatalf("slack id is not updated: %s(expected: %s)", user.SlackID, updatedSlackID)
		}
	})
}
