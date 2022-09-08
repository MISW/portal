// +build use_external_db

package persistence_test

import (
	"testing"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/testutil"
	"github.com/MISW/Portal/backend/mock/domain/repository"
	"github.com/google/go-cmp/cmp"
	"golang.org/x/net/context"
)

var (
	tokenTemplate = &domain.Token{
		UserID:    10,
		Token:     "VERY_SECURE_TOKEN",
		ExpiredAt: time.Unix(time.Now().Unix(), 0).Add(1 * time.Minute),
	}

	tokenTemplates = []*domain.Token{
		tokenTemplate,
	}
)

func compareToken(t *testing.T, expected *domain.Token, actual *domain.Token) {
	t.Helper()

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

	if diff := cmp.Diff(expected, actual); diff != "" {
		t.Errorf("tokens differ: %v", diff)
	}
}

func insertTestTokenData(t *testing.T, tp repository.TokenRepository) {
	t.Helper()

	for _, ps := range tokenTemplates {
		err := tp.Add(context.Background(), ps.UserID, ps.Token, ps.ExpiredAt)

		if err != nil {
			t.Errorf("inserting a new token to db failed(%v): %+v", ps, err)
		}
	}
}

func TestTokenInsert(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	tp := persistence.NewTokenPersistence(conn)

	insertTestTokenData(t, tp)
}

func TestTokenGet(t *testing.T) {
	t.Run("get_by_token", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		tp := persistence.NewTokenPersistence(conn)

		insertTestTokenData(t, tp)

		tk, err := tp.GetByToken(context.Background(), tokenTemplate.Token)

		if err != nil {
			t.Errorf("failed to get token by token: %+v", err)
		}

		compareToken(t, tokenTemplate, tk)
	})

}

func TestTokenDelete(t *testing.T) {
	t.Run("normal", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		tp := persistence.NewTokenPersistence(conn)

		insertTestTokenData(t, tp)

		err := tp.Delete(context.Background(), tokenTemplate.Token)

		if err != nil {
			t.Errorf("failed to delete a token: %+v", err)
		}
	})

	t.Run("all", func(t *testing.T) {
		conn := testutil.NewSQLConn(t)

		tp := persistence.NewTokenPersistence(conn)

		insertTestTokenData(t, tp)

		err := tp.DeleteAll(context.Background(), tokenTemplate.UserID)

		if err != nil {
			t.Errorf("failed to delete token for user id: %+v", err)
		}
	})
}
