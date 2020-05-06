// +build use_external_db

package persistence_test

import (
	"context"
	"testing"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/internal/testutil"
)

func TestUpdate(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	up := persistence.NewUserPersistence(conn)
	urp := persistence.NewUserRolePersistence(conn)

	id := insertTestUserData(t, up)

	updatedRole := domain.NotMember
	err := urp.Update(context.Background(), id, updatedRole)

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
}
