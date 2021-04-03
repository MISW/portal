package persistence

import (
	"context"
	"database/sql"
	"strings"
	"time"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"golang.org/x/xerrors"
)

// NewUserPersistence - ユーザのMySQL関連の実装
func NewUserPersistence(db db.Ext) repository.UserRepository {
	return &userPersistence{db: db}
}

type user struct {
	ID                   int            `db:"id"`
	Email                string         `db:"email"`
	Generation           int            `db:"generation"`
	Name                 string         `db:"name"`
	Kana                 string         `db:"kana"`
	Handle               string         `db:"handle"`
	Sex                  string         `db:"sex"`
	AvatarURL            sql.NullString `db:"avatar_url"`
	AvatarThumbnailURL   sql.NullString `db:"avatar_thumbnail_url"`
	University           string         `db:"university_name"`
	UniversityDepartment string         `db:"university_department"`
	UniversitySubject    string         `db:"university_subject"`
	StudentID            string         `db:"student_id"`
	EmergencyPhoneNumber string         `db:"emergency_phone_number"`
	OtherCircles         string         `db:"other_circles"`
	Workshops            string         `db:"workshops"`
	Squads               string         `db:"squads"`
	Role                 string         `db:"role"`

	SlackInvitationStatus string `db:"slack_invitation_status"`

	// 外部サービス
	SlackID           sql.NullString `db:"slack_id"`
	DiscordID         sql.NullString `db:"discord_id"`
	TwitterScreenName sql.NullString `db:"twitter_screen_name"`

	EmailVerified bool `db:"email_verified"`
	CardPublished bool `db:"card_published"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

func newUser(u *domain.User) *user {
	return &user{
		ID:         u.ID,
		Email:      u.Email,
		Generation: u.Generation,
		Name:       u.Name,
		Kana:       u.Kana,
		Handle:     u.Handle,
		Sex:        string(u.Sex),
		AvatarURL: sql.NullString{
			String: u.Avatar.URL,
			Valid:  len(u.Avatar.URL) != 0,
		},
		AvatarThumbnailURL: sql.NullString{
			String: u.Avatar.ThumbnailURL,
			Valid:  len(u.Avatar.ThumbnailURL) != 0,
		},
		University:           u.University.Name,
		UniversityDepartment: u.University.Department,
		UniversitySubject:    u.University.Subject,
		StudentID:            u.StudentID,
		EmergencyPhoneNumber: u.EmergencyPhoneNumber,
		OtherCircles:         u.OtherCircles,
		Workshops:            strings.Join(u.Workshops, "\n"),
		Squads:               strings.Join(u.Squads, "\n"),
		Role:                 string(u.Role),

		SlackInvitationStatus: string(u.SlackInvitationStatus),

		SlackID: sql.NullString{
			String: u.SlackID,
			Valid:  len(u.SlackID) != 0,
		},
		DiscordID: sql.NullString{
			String: u.DiscordID,
			Valid:  len(u.DiscordID) != 0,
		},
		TwitterScreenName: sql.NullString{
			String: u.TwitterScreenName,
			Valid:  len(u.TwitterScreenName) != 0,
		},

		EmailVerified: u.EmailVerified,
		CardPublished: u.CardPublished,

		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

func parseUser(u *user) *domain.User {
	var avatar *domain.Avatar
	if u.AvatarURL.Valid && u.AvatarThumbnailURL.Valid {
		avatar = &domain.Avatar{
			URL:          u.AvatarURL.String,
			ThumbnailURL: u.AvatarThumbnailURL.String,
		}
	}
	return &domain.User{
		ID:         u.ID,
		Email:      u.Email,
		Generation: u.Generation,
		Name:       u.Name,
		Kana:       u.Kana,
		Handle:     u.Handle,
		Sex:        domain.SexType(u.Sex),
		Avatar:     avatar,
		University: domain.University{
			Name:       u.University,
			Department: u.UniversityDepartment,
			Subject:    u.UniversitySubject,
		},
		StudentID:            u.StudentID,
		EmergencyPhoneNumber: u.EmergencyPhoneNumber,
		OtherCircles:         u.OtherCircles,
		Workshops:            strings.Split(u.Workshops, "\n"),
		Squads:               strings.Split(u.Squads, "\n"),
		Role:                 domain.RoleType(u.Role),

		SlackInvitationStatus: domain.SlackInvitationStatus(u.SlackInvitationStatus),

		SlackID:           u.SlackID.String,
		DiscordID:         u.DiscordID.String,
		TwitterScreenName: u.TwitterScreenName.String,

		EmailVerified: u.EmailVerified,
		CardPublished: u.CardPublished,

		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

type userPersistence struct {
	db db.Ext
}

var _ repository.UserRepository = &userPersistence{}

// Insert inserts new user to DB
func (up *userPersistence) Insert(ctx context.Context, user *domain.User) (int, error) {
	u := newUser(user)

	res, err := sqlx.NamedExec(up.db, `
	INSERT INTO users (
		email,
		generation,
		name,
		kana,
		handle,
		sex,
		avatar_url,
		avatar_thumbnail_url,
		university_name,
		university_department,
		university_subject,
		student_id,
		emergency_phone_number,
		other_circles,
		workshops,
		squads,
		role,
		slack_invitation_status,
		slack_id,
		discord_id,
		twitter_screen_name,
		email_verified,
		card_published
	) VALUES (
		:email,
		:generation,
		:name,
		:kana,
		:handle,
		:sex,
		:avatar_url,
		:avatar_thumbnail_url,
		:university_name,
		:university_department,
		:university_subject,
		:student_id,
		:emergency_phone_number,
		:other_circles,
		:workshops,
		:squads,
		:role,
		:slack_invitation_status,
		:slack_id,
		:discord_id,
		:twitter_screen_name,
		:email_verified,
		:card_published
	)
	`, u)

	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return 0, domain.ErrEmailConflicts
		}

		return 0, xerrors.Errorf("failed to insert new user: %w", err)
	}

	id, err := res.LastInsertId()

	if err != nil {
		return 0, xerrors.Errorf("failed to retrieve last insert id: %w", err)
	}

	return int(id), nil
}

// GetByID finds existing user by user's id
func (up *userPersistence) GetByID(ctx context.Context, id int) (*domain.User, error) {
	var u user
	if err := sqlx.Get(
		up.db,
		&u,
		`SELECT * FROM users WHERE id=?`,
		id,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, domain.ErrNoUser
		}

		return nil, xerrors.Errorf("failed to find user by id: %w", err)
	}

	return parseUser(&u), nil
}

// GetBySlackID finds existing user by user's Slack ID(neither name nor display name)
func (up *userPersistence) GetBySlackID(ctx context.Context, slackID string) (*domain.User, error) {
	var u user
	if err := sqlx.Get(
		up.db,
		&u,
		`SELECT * FROM users WHERE slack_id=?`,
		slackID,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, domain.ErrNoUser
		}

		return nil, xerrors.Errorf("failed to find user by Slack ID: %w", err)
	}

	return parseUser(&u), nil
}

// GetByID finds existing user by user's Email
func (up *userPersistence) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	var u user
	if err := sqlx.Get(
		up.db,
		&u,
		`SELECT * FROM users WHERE email=?`,
		email,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, domain.ErrNoUser
		}

		return nil, xerrors.Errorf("failed to find user by Email: %w", err)
	}

	return parseUser(&u), nil
}

// List returns all users
func (up *userPersistence) List(ctx context.Context) ([]*domain.User, error) {
	users := []*user{}

	if err := sqlx.Select(
		up.db,
		&users,
		`SELECT * FROM users`,
	); err != nil {
		return nil, xerrors.Errorf("failed to list users: %w", err)
	}

	res := make([]*domain.User, 0, len(users))

	for i := range users {
		res = append(res, parseUser(users[i]))
	}

	return res, nil
}

// ListByID - ユーザIDが一致する全てのユーザを取得
func (up *userPersistence) ListByID(ctx context.Context, ids []int) ([]*domain.User, error) {
	if len(ids) == 0 {
		return []*domain.User{}, nil
	}

	query, args, err := sqlx.In(`SELECT * FROM users WHERE id IN (?)`, ids)

	if err != nil {
		return nil, xerrors.Errorf("failed to prepare query for IN clause: %w", err)
	}

	users := []*user{}

	if err := sqlx.Select(
		up.db,
		&users,
		query,
		args...,
	); err != nil {
		return nil, xerrors.Errorf("failed to list users: %w", err)
	}

	res := make([]*domain.User, 0, len(users))

	for i := range users {
		res = append(res, parseUser(users[i]))
	}

	return res, nil
}

// Update - ユーザのプロフィールを更新する
func (up *userPersistence) Update(ctx context.Context, user *domain.User) error {
	u := newUser(user)

	_, err := sqlx.NamedExec(up.db, `
	UPDATE users SET
		email=:email,
		generation=:generation,
		name=:name,
		kana=:kana,
		handle=:handle,
		sex=:sex,
		avatar_url=:avatar_url,
		avatar_thumbnail_url=:avatar_thumbnail_url,
		university_name=:university_name,
		university_department=:university_department,
		university_subject=:university_subject,
		student_id=:student_id,
		emergency_phone_number=:emergency_phone_number,
		other_circles=:other_circles,
		workshops=:workshops,
		squads=:squads,
		role=:role,
		slack_invitation_status=:slack_invitation_status,
		slack_id=:slack_id,
		discord_id=:discord_id,
		twitter_screen_name=:twitter_screen_name,
		email_verified=:email_verified,
		card_published=:card_published
	WHERE id=:id
	`, u)

	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return domain.ErrEmailConflicts
		}

		return xerrors.Errorf("failed to update user(%d): %w", user.ID, err)
	}

	return nil
}

// VerifyEmail - メールアドレスを認証済みにする
func (up *userPersistence) VerifyEmail(ctx context.Context, id int, email string) error {
	res, err := up.db.Exec(`
	UPDATE users SET
		email_verified=1
	WHERE id=? AND email=?
	`, id, email)

	if err != nil {
		return xerrors.Errorf("failed to verify email(%d): %w", id, err)
	}

	affected, err := res.RowsAffected()

	if err != nil {
		return xerrors.Errorf("failed to get rows affected: %w", err)
	}

	if affected != 1 {
		return domain.ErrEmailAddressChanged
	}

	return nil
}
