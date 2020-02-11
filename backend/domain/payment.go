package domain

import "time"

// PaymentStatus - 支払い情報
type PaymentStatus struct {
	UserID     int `json:"user_id" yaml:"user_id"`
	Authorizer int `json:"authorizer"`

	// Period - 支払い区間(201904, 201910のようにYYYYMM)
	Period int `json:"period" yaml:"period"`

	CreatedAt time.Time `json:"created_at" yaml:"created_at"`
	UpdatedAt time.Time `json:"updated_at" yaml:"updated_at"`
}
