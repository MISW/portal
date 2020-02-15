// +build use_external_db

package persistence_test

import (
	"testing"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/MISW/Portal/backend/internal/testutil"
)

func insertTestData(t *testing.T, conn db.Ext, up repository.UserRepository) int {
	t.Helper()

	id, err := up.Insert(conn, &domain.User{
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
		StudentID:            "1W183088-4",
		EmergencyPhoneNumber: "0120117117",
		OtherCircles:         "WCE",
		Workshops:            []string{"Programming", "CG", "MIDI"},
		Squads:               []string{"Web", "Webデザイン"},
		SlackID:              "UAJXXXXXX",
	})

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
