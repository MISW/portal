package domain

// EmailKind - メール送信を行う種類
type EmailKind string

const (
	// EmailVerification - Eメール認証で送信するメール
	EmailVerification EmailKind = "email_verification"

	// SlackInvitation - Slack招待の際に同時に送信するリンク
	SlackInvitation EmailKind = "slack_invitation"
)

var (
	allEmailKinds = []EmailKind{
		EmailVerification,
		SlackInvitation,
	}
)

// Validate - Email Kindの検証
func (ek EmailKind) Validate() bool {
	for i := range allEmailKinds {
		if allEmailKinds[i] == ek {
			return true
		}
	}

	return false
}
