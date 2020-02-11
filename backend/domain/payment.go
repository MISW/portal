package domain

import "time"

type Period struct {
	Year   int    `json:"year" yaml:"year"`
	Season string `json:"season" yaml:"season"`
}

// PaymentStatus - 支払い情報
type PaymentStatus struct {
	// Period - いつの
	Period     *Period   `json:"period" yaml:"period"`
	Time       time.Time `json:"time" yaml:"time"`
	Authorizer int       `json:"authorizer"`
}
