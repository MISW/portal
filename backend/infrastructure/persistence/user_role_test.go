// +build use_external_db

package persistence_test

import (
	"context"
	"testing"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
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
		t.Errorf("failed to update role: %+v", err)
	}

	user, err := up.GetByID(context.Background(), id)

	if err != nil {
		t.Errorf("failed to get user: %+v", err)
	}

	if user.Role != updatedRole {
		t.Errorf("role is not updated: %s(expected: %s)", user.Role, updatedRole)
	}
}

func insertUsers(t *testing.T, userRepository repository.UserRepository, users []*domain.User) {
	t.Helper()
	ctx := context.Background()

	for i := range users {
		id, err := userRepository.Insert(ctx, users[i])

		if err != nil {
			t.Errorf("failed to insert user: %+v", err)
		}

		users[i].ID = id
	}
}

func insertPaymentStatuses(t *testing.T, paymentStatusRepository repository.PaymentStatusRepository, paymentStatuses []*domain.PaymentStatus) {
	t.Helper()
	ctx := context.Background()

	for i := range paymentStatuses {
		err := paymentStatusRepository.Add(ctx, paymentStatuses[i].UserID, paymentStatuses[i].Period, paymentStatuses[i].Authorizer)

		if err != nil {
			t.Errorf("failed to insert payment status: %+v", err)
		}
	}
}

func TestUpdateRoleWithRule(t *testing.T) {
	conn := testutil.NewSQLConn(t)

	up := persistence.NewUserPersistence(conn)
	psr := persistence.NewPaymentStatusPersistence(conn)
	urp := persistence.NewUserRolePersistence(conn)

	users := []*domain.User{
		{
			Email:                 "mischan@example.com",
			Generation:            54,
			Sex:                   domain.Female,
			Role:                  domain.Member,
		},
		{
			Email:                 "mischan2@example.com",
			Generation:            54,
			Sex:                   domain.Female,
			Role:                  domain.NotMember,
		},
		{
			Email:                 "mischan3@example.com",
			Generation:            54,
			Sex:                   domain.Female,
			Role:                  domain.Admin,
		},
	}

	insertUsers(t, up, users)

	paymentStatuses := []*domain.PaymentStatus{
		{
			UserID:     users[0].ID,
			Authorizer: users[0].ID,
			Period:     201910,
		},
		{
			UserID:     users[1].ID,
			Authorizer: users[1].ID,
			Period:     201910,
		},
		{
			UserID:     users[2].ID,
			Authorizer: users[2].ID,
			Period:     201910,
		},
		{
			UserID:     users[0].ID,
			Authorizer: users[0].ID,
			Period:     202004,
		},
		{
			UserID:     users[1].ID,
			Authorizer: users[1].ID,
			Period:     202004,
		},
		{
			UserID:     users[2].ID,
			Authorizer: users[2].ID,
			Period:     202004,
		},
	}

	insertPaymentStatuses(t, psr, paymentStatuses)

	ctx := context.Background()

	t.Run("one", func(t *testing.T) {
		expectedRoles := []domain.RoleType{domain.Member, domain.Member, domain.Admin}
		for i := range users {
			if err := urp.UpdateWithRule(ctx, users[i].ID, 201910, 202004); err != nil {
				t.Errorf("failed to update role with rule(%d): %+v", users[i].ID, err)
			}

			user, err := up.GetByID(ctx, users[i].ID)

			if err != nil {
				t.Errorf("failed to get user(%d): %+v", users[i].ID, err)
			}

			if user.Role != expectedRoles[i] {
				t.Errorf("expected role for user(%d) is %v, but got %v: %+v", users[i].ID, expectedRoles[i], user.Role, err)
			}
		}

		for i := range users {
			if err := urp.UpdateWithRule(ctx, users[i].ID, 201910, 202010); err != nil {
				t.Errorf("failed to update role with rule(%d): %+v", users[i].ID, err)
			}

			user, err := up.GetByID(ctx, users[i].ID)

			if err != nil {
				t.Errorf("failed to get user(%d): %+v", users[i].ID, err)
			}

			if user.Role != expectedRoles[i] {
				t.Errorf("expected role for user(%d) is %v, but got %v: %+v", users[i].ID, expectedRoles[i], user.Role, err)
			}
		}

		expectedRoles = []domain.RoleType{domain.NotMember, domain.NotMember, domain.Admin}
		for i := range users {
			if err := urp.UpdateWithRule(ctx, users[i].ID, 201804, 201810); err != nil {
				t.Errorf("failed to update role with rule(%d): %+v", users[i].ID, err)
			}

			user, err := up.GetByID(ctx, users[i].ID)

			if err != nil {
				t.Errorf("failed to get user(%d): %+v", users[i].ID, err)
			}

			if user.Role != expectedRoles[i] {
				t.Errorf("expected role for user(%d) is %v, but got %v: %+v", users[i].ID, expectedRoles[i], user.Role, err)
			}
		}
	})

	t.Run("all", func(t *testing.T) {
		expectedRoles := []domain.RoleType{domain.Member, domain.Member, domain.Admin}
		if err := urp.UpdateAllWithRule(ctx, 201910, 202004); err != nil {
			t.Errorf("failed to update role with rule: %+v", err)
		}
		for i := range users {
			user, err := up.GetByID(ctx, users[i].ID)

			if err != nil {
				t.Errorf("failed to get user(%d): %+v", users[i].ID, err)
			}

			if user.Role != expectedRoles[i] {
				t.Errorf("expected role for user(%d) is %v, but got %v: %+v", users[i].ID, expectedRoles[i], user.Role, err)
			}
		}

		if err := urp.UpdateAllWithRule(ctx, 201804, 202004); err != nil {
			t.Errorf("failed to update role with rule: %+v", err)
		}
		for i := range users {
			user, err := up.GetByID(ctx, users[i].ID)

			if err != nil {
				t.Errorf("failed to get user(%d): %+v", users[i].ID, err)
			}

			if user.Role != expectedRoles[i] {
				t.Errorf("expected role for user(%d) is %v, but got %v: %+v", users[i].ID, expectedRoles[i], user.Role, err)
			}
		}

		expectedRoles = []domain.RoleType{domain.NotMember, domain.NotMember, domain.Admin}
		if err := urp.UpdateAllWithRule(ctx, 201804, 201810); err != nil {
			t.Errorf("failed to update role with rule: %+v", err)
		}
		for i := range users {
			user, err := up.GetByID(ctx, users[i].ID)

			if err != nil {
				t.Errorf("failed to get user(%d): %+v", users[i].ID, err)
			}

			if user.Role != expectedRoles[i] {
				t.Errorf("expected role for user(%d) is %v, but got %v: %+v", users[i].ID, expectedRoles[i], user.Role, err)
			}
		}
	})
}
