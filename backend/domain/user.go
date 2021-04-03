package domain

import (
	"regexp"
	"strings"
	"time"

	"github.com/MISW/Portal/backend/internal/rest"
	"golang.org/x/xerrors"
)

// SexType - 性別
type SexType string

const (
	// Male - 男性
	Male SexType = "male"
	// Female - 女性
	Female SexType = "female"
	// Other - その他
	Other SexType = "other" // not used
)

// RoleType - サークル員の種別
type RoleType string

const (
	// Admin - 管理者(会員資格あり)
	Admin RoleType = "admin"

	// Member - 正式なメンバー(会員資格あり)
	Member RoleType = "member"

	// Retired - 引退済みのメンバー(会員資格あり)
	Retired RoleType = "retired"

	// NotMember - 未払い状態のメンバー(会員資格なし)
	NotMember RoleType = "not_member"
)

// Validate - 存在しているroleかどうかチェックし、すればtrue、しなければfalseを返す
func (r RoleType) Validate() bool {
	for i := range Roles {
		if Roles[i] == r {
			return true
		}
	}

	return false
}

// GetNewRole - paidの状態によって次のroleの状態遷移を定義する
func (r RoleType) GetNewRole(paid bool) RoleType {
	switch r {
	case Admin, Retired:
		return r
	}

	if paid {
		return Member
	}

	return NotMember
}

var (
	// Roles are all roles
	Roles = []RoleType{
		Admin,
		Member,
		Retired,
		NotMember,
	}
)

// University - 所属大学
type University struct {
	Name       string `json:"name" yaml:"name"`
	Department string `json:"department" yaml:"department"`
	Subject    string `json:"subject" yaml:"subject"`
}

// Avatar - アイコン画像
type Avatar struct {
	URL          string `json:"url" yaml:"url"`
	ThumbnailURL string `json:"thumbnail_url" yaml:"thumbnail_url"`
}

// SlackInvitationStatus - Slack招待のステータス
type SlackInvitationStatus string

const (
	// Never - not invited
	Never SlackInvitationStatus = "never"
	// Pending - requested to invite
	Pending SlackInvitationStatus = "pending"
	// Invited - already invited
	Invited SlackInvitationStatus = "invited"
)

var (
	// SlackInvitationStatuses contains all statuses
	SlackInvitationStatuses = []SlackInvitationStatus{
		Never,
		Pending,
		Invited,
	}
)

// Validate - 存在しているroleかどうかチェックし、すればtrue、しなければfalseを返す
func (r SlackInvitationStatus) Validate() bool {
	for i := range SlackInvitationStatuses {
		if SlackInvitationStatuses[i] == r {
			return true
		}
	}

	return false
}

// User - サークル員の情報
type User struct {
	ID                   int        `json:"id" yaml:"id"`
	Email                string     `json:"email" yaml:"email"`
	Generation           int        `json:"generation" yaml:"generation"`
	Name                 string     `json:"name" yaml:"name"`
	Kana                 string     `json:"kana" yaml:"kana"`
	Handle               string     `json:"handle" yaml:"handle"`
	Avatar               *Avatar    `json:"avatar,omitempty" yaml:"avatar,omitempty"`
	Sex                  SexType    `json:"sex" yaml:"sex"`
	University           University `json:"university" yaml:"university"`
	StudentID            string     `json:"student_id" yaml:"student_id"`
	EmergencyPhoneNumber string     `json:"emergency_phone_number" yaml:"emergency_phone_number"`
	OtherCircles         string     `json:"other_circles" yaml:"other_circles"`
	Workshops            []string   `json:"workshops" yaml:"workshops"`
	Squads               []string   `json:"squads" yaml:"squads"`
	Role                 RoleType   `json:"role" yaml:"role"`

	SlackInvitationStatus SlackInvitationStatus `json:"slack_invitation_status" yaml:"slack_invitation_status"`

	// 外部サービス
	SlackID           string `json:"slack_id" yaml:"slack_id"`
	DiscordID         string `json:"discord_id,omitempty" yaml:"discord_id,omitempty"`
	TwitterScreenName string `json:"twitter_screen_name,omitempty" yaml:"twitter_screen_name,omitempty"`

	EmailVerified bool `json:"email_verified" yaml:"email_verified"`
	CardPublished bool `json:"card_published" yaml:"card_published"`

	CreatedAt time.Time `json:"created_at" yaml:"created_at"`
	UpdatedAt time.Time `json:"updated_at" yaml:"updated_at"`
}

// UserPaymentStatus - サークル員情報と支払い情報一期分の情報
type UserPaymentStatus struct {
	User
	PaymentStatus *PaymentStatus `json:"payment_status" yaml:"payment_status"`
}

var (
	emailValidator = regexp.MustCompile(`^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$`)

	discordValidator = regexp.MustCompile(`(.*)#(\d{4})`)

	twitterScreenNameValidator = regexp.MustCompile(`[\w_]+`)

	invalidWordsForSquads = []string{"\n", "\r"}
)

// Validate - userを検証
func (user *User) Validate() error {
	for i := range user.Squads {
		for j := range invalidWordsForSquads {
			if strings.Contains(user.Squads[i], invalidWordsForSquads[j]) {
				return rest.NewBadRequest("班の名前に使えない文字を含んでいます")
			}
		}
	}

	if user.Sex != Male && user.Sex != Female {
		return rest.NewBadRequest("性別の値が不正です")
	}
	if !emailValidator.MatchString(user.Email) {
		return rest.NewBadRequest("メールアドレスの形式が不正です")
	}
	if user.DiscordID != "" && !discordValidator.MatchString(user.DiscordID) {
		return rest.NewBadRequest("DiscordIDの形式が不正です")
	}
	if user.TwitterScreenName != "" && !twitterScreenNameValidator.MatchString(user.TwitterScreenName) {
		return rest.NewBadRequest("Twitterのスクリーンネームの形式が不正です")
	}
	if !user.Role.Validate() {
		return rest.NewBadRequest("存在しないロールが指定されています")
	}
	if !user.SlackInvitationStatus.Validate() {
		return rest.NewBadRequest("存在しないSlack招待ステータスが指定されています")
	}

	if len(user.SlackID) != 0 &&
		(user.SlackInvitationStatus == Pending ||
			user.SlackInvitationStatus == Never) {
		return rest.NewBadRequest("既にSlackに参加済みです")
	}

	// TODO: 100代までもし使う場合は修正
	if user.Generation < 49 || user.Generation > 100 {
		return rest.NewBadRequest("不正な代が入力されています")
	}

	return nil
}

var (
	// ErrEmailConflicts - emailが既に登録されている
	ErrEmailConflicts = xerrors.New("email conflicts")

	// ErrSlackIDConflicts - Slack IDが既に登録されている
	ErrSlackIDConflicts = xerrors.New("slack id conflicts")

	// ErrNoUser - Userが存在しない
	ErrNoUser = xerrors.New("no such user")

	// ErrEmailAddressChanged - 既にEメールアドレスが変更されており、認証が失敗した
	ErrEmailAddressChanged = xerrors.New("email address has been changed")
)
