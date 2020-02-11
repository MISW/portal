package domain

// SexType - 性別
type SexType int

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

// Workshop - 研究会と班の所属
type Workshop struct {
	Name   string   `json:"name" yaml:"name"`
	Squads []string `json:"squads" yaml:"squads"`
}

// User - サークル員の情報
type User struct {
	ID                   int         `json:"id" yaml:"id"`
	Email                string      `json:"email" yaml:"email"`
	Generation           int         `json:"generation" yaml:"generation"`
	Name                 string      `json:"name" yaml:"name"`
	Kana                 string      `json:"kana" yaml:"kana"`
	Handle               string      `json:"handle" yaml:"handle"`
	Sex                  *SexType    `json:"sex" yaml:"sex"`
	University           *University `json:"university" yaml:"university"`
	StudentID            string      `json:"student_id" yaml:"student_id"`
	EmergencyPhoneNumber string      `json:"emergency_phone_number" yaml:"emergency_phone_number"`
	OtherCircles         []string    `json:"other_circles" yaml:"other_circles"`
	Workshop             []Workshop  `json:"workshops" yaml:"workshops"`

	// PaymentStatus - サークル費の支払い状況
	PaymentStatus []PaymentStatus `json:"payment_status" yaml:"payment_status"`

	// 外部サービス

	SlackID string `json:"slack_id" yaml:"slack_id"`
}
