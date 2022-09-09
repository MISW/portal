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
		EmailVerified:         false,
		AccountID:               "oauth|1xxxxxxx",
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
		EmailVerified:         true,
		AccountID:               "oauth|2xxxxxxx",
		DiscordID:             "mischan#0123",
	}
)

func insertTestUserData(t *testing.T, up repository.UserRepository) int {
	t.Helper()

	id, err := up.Insert(context.Background(), userTemplate)

	if err != nil {
		t.Errorf("inserting a new user to db failed: %+v", err)
	}

	return id
}

func compareUser(t *testing.T, expected, actual *domain.User) {
	e := *expected
	expected = &e

	if actual.CreatedAt.Before(time.Now().Add(-1*time.Minute)) || actual.CreatedAt.After(time.Now()) {
		t.Errorf("created_at is invalid: %+v", actual.CreatedAt)
	}
	if actual.UpdatedAt.Before(time.Now().Add(-1*time.Minute)) || actual.UpdatedAt.After(time.Now()) {
		t.Errorf("updated_at is invalid: %+v", actual.UpdatedAt)
	}

	expected.CreatedAt = actual.CreatedAt
	expected.UpdatedAt = actual.UpdatedAt
	expected.ID = actual.ID

	if diff := cmp.Diff(expected, actual); diff != "" {
		t.Errorf("users differ: %v", diff)
	}
}

func TestInsert(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	up := persistence.NewUserPersistence(conn)

	id := insertTestUserData(t, up)

	if id == 0 {
		t.Errorf("id shoule not be 0, but %d", id)
	}

	_, err := up.Insert(context.Background(), userTemplate)

	if err != domain.ErrEmailConflicts {
		t.Errorf("the second insert should return ErrEmailConflicts: %+v", err)
	}
}

func TestGet(t *testing.T) {
	t.Run("get_by_id", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		user, err := up.GetByID(context.Background(), id)

		if err != nil {
			t.Errorf("failed to get user by id: %+v", err)
		}

		compareUser(t, userTemplate, user)
	})

	t.Run("get_by_email", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		insertTestUserData(t, up)

		user, err := up.GetByEmail(context.Background(), userTemplate.Email)

		if err != nil {
			t.Errorf("failed to get user by id: %+v", err)
		}

		compareUser(t, userTemplate, user)
	})

	t.Run("get_by_account", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		insertTestUserData(t, up)

		user, err := up.GetByAccountID(context.Background(), userTemplate.AccountID)

		if err != nil {
			t.Errorf("failed to get user by id: %+v", err)
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
			t.Errorf("failed to list users: %+v", err)
		}

		if expected := 1; len(users) != expected {
			t.Errorf("list should return %d users, but returned %d", expected, len(users))
		}

		compareUser(t, userTemplate, users[0])
	})

	t.Run("by_id_normal", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		users, err := up.ListByID(context.Background(), []int{id})

		if err != nil {
			t.Errorf("failed to list users: %+v", err)
		}

		if expected := 1; len(users) != expected {
			t.Errorf("list should return %d users, but returned %d", expected, len(users))
		}

		compareUser(t, userTemplate, users[0])
	})

	t.Run("by_no_id", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		insertTestUserData(t, up)

		users, err := up.ListByID(context.Background(), []int{})

		if err != nil {
			t.Errorf("failed to list users: %+v", err)
		}

		if expected := 0; len(users) != expected {
			t.Errorf("list should return %d users, but returned %d", expected, len(users))
		}
	})

}

func TestUserUpdate(t *testing.T) {
	t.Run("normal", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		tmp2 := *userTemplate2

		tmp2.ID = id

		err := up.Update(context.Background(), &tmp2)

		if err != nil {
			t.Errorf("failed to update user: %+v", err)
		}

		user, err := up.GetByID(context.Background(), id)

		if err != nil {
			t.Errorf("failed to get user: %+v", err)
		}

		compareUser(t, &tmp2, user)
	})
}

func TesstVerifyEmail(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	up := persistence.NewUserPersistence(conn)

	id := insertTestUserData(t, up)

	ctx := context.Background()

	user, err := up.GetByID(ctx, id)

	if err != nil {
		t.Errorf("GetByID failed: %+v", err)
	}

	if user.EmailVerified {
		t.Errorf("EmailVerified should be false")
	}

	if err := up.VerifyEmail(ctx, id, userTemplate.Email); err != nil {
		t.Errorf("VerifyEmail failed: %+v", err)
	}

	user, err = up.GetByID(ctx, id)

	if err != nil {
		t.Errorf("GetByID failed: %+v", err)
	}

	if !user.EmailVerified {
		t.Errorf("EmailVerified should be true")
	}

	if err := up.VerifyEmail(ctx, id, userTemplate.Email); err != domain.ErrEmailAddressChanged {
		t.Errorf("VerifyEmail should return ErrEmailAddressChanged: %+v", err)
	}
}
