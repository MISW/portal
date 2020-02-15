// +build use_external_db

package persistence_test

import (
	"testing"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/db"
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
		SlackID:              "UAJXXXXXX",
	}
)

func insertTestData(t *testing.T, conn db.Ext, up repository.UserRepository) int {
	t.Helper()

	id, err := up.Insert(conn, userTemplate)

	if err != nil {
		t.Fatalf("inserting a new user to db failed: %+v", err)
	}

	return id
}

func TestInsert(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	up := persistence.NewUserPersistence()

	id := insertTestData(t, conn, up)

	if id == 0 {
		t.Fatalf("id shoule not be 0, but %d", id)
	}
}

func TestGet(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	up := persistence.NewUserPersistence()

	id := insertTestData(t, conn, up)

	user, err := up.GetByID(conn, id)

	if err != nil {
		t.Fatalf("failed to get user by id: %+v", err)
	}

	if user.CreatedAt.After(time.Now().Add(-1*time.Minute)) || user.CreatedAt.Before(time.Now()) {
		t.Fatalf("created_at is invalid: %+v", err)
	}
	if user.UpdatedAt.After(time.Now().Add(-1*time.Minute)) || user.UpdatedAt.Before(time.Now()) {
		t.Fatalf("updated_at is invalid: %+v", err)
	}

	expectedUser := *userTemplate

	expectedUser.CreatedAt = user.CreatedAt
	expectedUser.UpdatedAt = user.UpdatedAt
	expectedUser.ID = id

	if diff := cmp.Diff(&expectedUser, user); diff != "" {
		t.Fatalf("users differ: %v", diff)
	}
}
