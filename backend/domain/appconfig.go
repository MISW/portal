package domain

// EmailKind - メール送信を行う種類
type EmailKind string

const (
	// EmailVerification - Eメール認証で送信するメール
	EmailVerification EmailKind = "email_verification"

	// SlackInvitation - Slack招待の際に同時に送信するリンク
	SlackInvitation EmailKind = "slack_invitation"
)
