package domain

// EmailKind - メール送信を行う種類
type EmailKind string

const (
	// EmailVerification - Eメール認証で送信するメール
	EmailVerification EmailKind = "email_verification"

	// AfterRegistration - 新規登録時(メール確認後)
	AfterRegistration EmailKind = "after_registration"

	// PaymentReminder - 支払いが完了していないメンバーに対してメールを送る
	PaymentReminder EmailKind = "payment_reminder"
)

var (
	allEmailKinds = []EmailKind{
		EmailVerification,
		AfterRegistration,
		PaymentReminder,
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
