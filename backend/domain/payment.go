package domain

import (
	"time"

	"golang.org/x/xerrors"
)

// PaymentStatus - 支払い情報
type PaymentStatus struct {
	UserID     int `json:"user_id" yaml:"user_id"`
	Authorizer int `json:"authorizer" yaml:"authorizer"`

	// Period - 支払い区間(201904, 201910のようにYYYYMM)
	Period int `json:"period" yaml:"period"`

	CreatedAt time.Time `json:"created_at" yaml:"created_at"`
	UpdatedAt time.Time `json:"updated_at" yaml:"updated_at"`
}

type PaymentTransaction struct {
	Token  string `json:"token" yaml:"token"`
	UserID int    `json:"user_id" yaml:"user_id"`

	CreatedAt time.Time `json:"created_at" yaml:"created_at"`
	ExpiredAt time.Time `json:"expired_at" yaml:"expired_at"`
}

var (
	// ErrAlreadyPaid - 既に支払が完了している
	ErrAlreadyPaid = xerrors.New("the user already paid")

	// ErrNoPaymentStatus - 一件も支払履歴がない
	ErrNoPaymentStatus = xerrors.New("no payment status")

	// ErrNoPaymentTransaction - 支払い処理トランザクションが存在しない
	ErrNoPaymentTransaction = xerrors.New("no  transaction")
)
