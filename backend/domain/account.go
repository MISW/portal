package domain

import (
	"github.com/MISW/Portal/backend/internal/rest"
)

// AccountInfo - ソーシャルログインしたアカウントの情報. Signupする前に用いる
type AccountInfo struct {
	Token     string `json:"token"`
	AccountID string `json:"sub"`
	Email     string `json:"email"`
}

func NewAccountInfo(token, accountID, email string) AccountInfo {
	return AccountInfo{
		Token:     token,
		AccountID: accountID,
		Email:     email,
	}
}

// Validate - account_infoを検証
func (account *AccountInfo) Validate() error {
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
