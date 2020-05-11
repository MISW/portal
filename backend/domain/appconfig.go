package domain

// EmailKind - メール送信を行う種類
type EmailKind string

const (
	// EmailVerification - Eメール認証で送信するメール
	EmailVerification EmailKind = "email_verification"

	// SlackInvitation - Slack招待の際に同時に送信するリンク
	SlackInvitation EmailKind = "slack_invitation"

	// AfterRegistration - 新規登録時(メール確認後)
	AfterRegistration EmailKind = "after_registration"
)

var (
	allEmailKinds = []EmailKind{
		EmailVerification,
		SlackInvitation,
		AfterRegistration,
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
