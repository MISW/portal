package repository

import context "context"

//go:generate mockgen -source=$GOFILE -destination=mock_$GOFILE -package=$GOPACKAGE

type SlackRepository interface {
	// UpdateSlackID - ユーザのSlack IDを更新する
	UpdateSlackID(ctx context.Context, id int, slackID string) error

	// MarkUninvitedMembersAsPending - メンバーかつユーザをSlackに招待するとmarkする
	MarkUninvitedMembersAsPending(ctx context.Context) error
}
