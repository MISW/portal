package domain

import "time"

// Token - 認証用トークン
type Token struct {
	UserID    int       `json:"user_id" yaml:"user_id"`
	Token     string    `json:"token" yaml:"token"`
	ExpiredAt time.Time `json:"expired_at" yaml:"expired_at"`

	CreatedAt time.Time `json:"created_at" yaml:"created_at"`
	UpdatedAt time.Time `json:"updated_at" yaml:"updated_at"`
}
