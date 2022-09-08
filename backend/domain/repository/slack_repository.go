package repository

import (
	context "context"

	domain "github.com/MISW/Portal/backend/domain"
)

type SlackRepository interface {
	// UpdateSlackID - ユーザのSlack IDを更新する
	UpdateSlackID(ctx context.Context, id int, slackID string) error

	// MarkUninvitedMembersAsPending - メンバーかつユーザをSlackに招待するとmarkする
	MarkUninvitedAsPending(ctx context.Context) error

	// GetPending - Pendingのユーザを一つ取得
	GetPending(ctx context.Context) (*domain.User, error)

	// MarkAsInvited - PendingのユーザをInvitedにする
	MarkAsInvited(ctx context.Context, id int) error
}
