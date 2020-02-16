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
		Sex:        domain.Men,
		University: &domain.University{
			Name:       "早稲田大学",
			Department: "基幹理工学部",
			Subject:    "情報理工学科",
		},
		StudentID:            "1W180000-0",
		EmergencyPhoneNumber: "0120117117",
		OtherCircles:         "WCE",
		Workshops:            []string{"Programming", "CG", "MIDI"},
		Squads:               []string{"Web", "Webデザイン"},
		Role:                 domain.Admin,
		SlackID:              "UAJXXXXXX",
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

func TestInsert(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	up := persistence.NewUserPersistence(conn)

	id := insertTestUserData(t, up)

	if id == 0 {
		t.Fatalf("id shoule not be 0, but %d", id)
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

		if user.CreatedAt.Before(time.Now().Add(-1*time.Minute)) || user.CreatedAt.After(time.Now()) {
			t.Fatalf("created_at is invalid: %+v", user.CreatedAt)
		}
		if user.UpdatedAt.Before(time.Now().Add(-1*time.Minute)) || user.UpdatedAt.After(time.Now()) {
			t.Fatalf("updated_at is invalid: %+v", user.UpdatedAt)
		}

		expectedUser := *userTemplate

		expectedUser.CreatedAt = user.CreatedAt
		expectedUser.UpdatedAt = user.UpdatedAt
		expectedUser.ID = id

		if diff := cmp.Diff(&expectedUser, user); diff != "" {
			t.Fatalf("users differ: %v", diff)
		}
	})

	t.Run("get_by_email", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		user, err := up.GetByEmail(context.Background(), userTemplate.Email)

		if err != nil {
			t.Fatalf("failed to get user by id: %+v", err)
		}

		if user.CreatedAt.Before(time.Now().Add(-1*time.Minute)) || user.CreatedAt.After(time.Now()) {
			t.Fatalf("created_at is invalid: %+v", user.CreatedAt)
		}
		if user.UpdatedAt.Before(time.Now().Add(-1*time.Minute)) || user.UpdatedAt.After(time.Now()) {
			t.Fatalf("updated_at is invalid: %+v", user.UpdatedAt)
		}

		expectedUser := *userTemplate

		expectedUser.CreatedAt = user.CreatedAt
		expectedUser.UpdatedAt = user.UpdatedAt
		expectedUser.ID = id

		if diff := cmp.Diff(&expectedUser, user); diff != "" {
			t.Fatalf("users differ: %v", diff)
		}
	})

	t.Run("get_by_slack", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		user, err := up.GetBySlackID(context.Background(), userTemplate.SlackID)

		if err != nil {
			t.Fatalf("failed to get user by id: %+v", err)
		}

		if user.CreatedAt.Before(time.Now().Add(-1*time.Minute)) || user.CreatedAt.After(time.Now()) {
			t.Fatalf("created_at is invalid: %+v", user.CreatedAt)
		}
		if user.UpdatedAt.Before(time.Now().Add(-1*time.Minute)) || user.UpdatedAt.After(time.Now()) {
			t.Fatalf("updated_at is invalid: %+v", user.UpdatedAt)
		}

		expectedUser := *userTemplate

		expectedUser.CreatedAt = user.CreatedAt
		expectedUser.UpdatedAt = user.UpdatedAt
		expectedUser.ID = id

		if diff := cmp.Diff(&expectedUser, user); diff != "" {
			t.Fatalf("users differ: %v", diff)
		}
	})

}

func TestList(t *testing.T) {
	t.Run("normal", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		up := persistence.NewUserPersistence(conn)

		id := insertTestUserData(t, up)

		users, err := up.List(context.Background())

		if err != nil {
			t.Fatalf("failed to list users: %+v", err)
		}

		if expected := 1; len(users) != expected {
			t.Fatalf("list should return %d users, but returned %d", expected, len(users))
		}

		expectedUser := *userTemplate

		expectedUser.CreatedAt = users[0].CreatedAt
		expectedUser.UpdatedAt = users[0].UpdatedAt
		expectedUser.ID = id

		if diff := cmp.Diff(&expectedUser, users[0]); diff != "" {
			t.Fatalf("users differ: %v", diff)
		}

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

		expectedUser := *userTemplate

		expectedUser.CreatedAt = users[0].CreatedAt
		expectedUser.UpdatedAt = users[0].UpdatedAt
		expectedUser.ID = id

		if diff := cmp.Diff(&expectedUser, users[0]); diff != "" {
			t.Fatalf("users differ: %v", diff)
		}

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
