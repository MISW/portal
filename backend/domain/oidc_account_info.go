package domain

import (
	"github.com/MISW/Portal/backend/internal/rest"
)

// OIDCAccountInfo - ソーシャルログインしたアカウントの情報. Signupする前に用いる
type OIDCAccountInfo struct {
	Token     string `json:"token"`
	AccountID string `json:"account_id"` //auth0のsub
	Email     string `json:"email"`
}

func NewOIDCAccountInfo(token, accountID, email string) OIDCAccountInfo {
	return OIDCAccountInfo{
		Token:     token,
		AccountID: accountID,
		Email:     email,
	}
}

// Validate - oidc_account_infoを検証
func (account *OIDCAccountInfo) Validate() error {
	if len(account.Token) == 0 {
		return rest.NewBadRequest("トークンが空です")
	}

	if len(account.AccountID) == 0 {
		return rest.NewBadRequest("アカウントIDが空です")
	}

	if !emailValidator.MatchString(account.Email) {
		return rest.NewBadRequest("メールアドレスの形式が不正です")
	}

	return nil
}
