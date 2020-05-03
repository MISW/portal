package slack

import (
	"context"

	"github.com/slack-go/slack"
	"golang.org/x/xerrors"
)

// NewClient - Slack クライアントを初期化する
func NewClient(token, teamName string) *Client {
	return &Client{
		client:   slack.New(token),
		teamName: teamName,
	}
}

// Client - Slackのクライアントライブラリのラッパー
type Client struct {
	teamName string
	client   *slack.Client
}

// InviteToTeam - 新規メンバーをSlackに招待する
func (c *Client) InviteToTeam(ctx context.Context, firstName, lastName, emailAddress string) error {
	if err := c.client.InviteToTeamContext(ctx, c.teamName, firstName, lastName, emailAddress); err != nil {
		return xerrors.Errorf("failed to send invitation via slack API to %s: %w", emailAddress, err)
	}

	return nil
}

// GetUserProfileByID - UserProfileをIDから取得する
func (c *Client) GetUserProfileByID(ctx context.Context, id string) (string, error) {
	user, err := c.client.GetUserInfoContext(ctx, id)

	if err != nil {
		return "", xerrors.Errorf("failed to get user profile: %w", err)
	}

	return user.Profile.Email, nil
}
