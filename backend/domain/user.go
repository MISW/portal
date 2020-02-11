package domain

import (
	"time"

	"golang.org/x/xerrors"
)

// SexType - 性別
type SexType string

const (
	// Men - 男性
	Men SexType = "men"
	// Women - 女性
	Women SexType = "women"
	// Other - その他
	Other SexType = "other" // not used
)

// University - 所属大学
type University struct {
	Name       string `json:"name" yaml:"name"`
	Department string `json:"department" yaml:"department"`
	Subject    string `json:"subject" yaml:"subject"`
}

// User - サークル員の情報
type User struct {
	ID                   int         `json:"id" yaml:"id"`
	Email                string      `json:"email" yaml:"email"`
	Generation           int         `json:"generation" yaml:"generation"`
	Name                 string      `json:"name" yaml:"name"`
	Kana                 string      `json:"kana" yaml:"kana"`
	Handle               string      `json:"handle" yaml:"handle"`
	Sex                  SexType     `json:"sex" yaml:"sex"`
	University           *University `json:"university" yaml:"university"`
	StudentID            string      `json:"student_id" yaml:"student_id"`
	EmergencyPhoneNumber string      `json:"emergency_phone_number" yaml:"emergency_phone_number"`
	OtherCircles         string      `json:"other_circles" yaml:"other_circles"`
	Workshops            []string    `json:"workshops" yaml:"workshops"`
	Squads               []string    `json:"squads" yaml:"squads"`

	// 外部サービス
	SlackID string `json:"slack_id" yaml:"slack_id"`

	CreatedAt time.Time `json:"created_at" yaml:"created_at"`
	UpdatedAt time.Time `json:"updated_at" yaml:"updated_at"`
}

var (
	// ErrEmailConflicts - emailが既に登録されている
	ErrEmailConflicts = xerrors.New("email conflicts")
)
