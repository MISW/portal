package persistence

import (
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
func NewUserPersistence() repository.UserRepository {
	return &userPersistence{}
}

type user struct {
	ID                   int    `db:"id"`
	Email                string `db:"email"`
	Generation           int    `db:"generation"`
	Name                 string `db:"name"`
	Kana                 string `db:"kana"`
	Handle               string `db:"handle"`
	Sex                  string `db:"sex"`
	University           string `db:"university_name"`
	UniversityDepartment string `db:"university_department"`
	UniversitySubject    string `db:"university_subject"`
	StudentID            string `db:"student_id"`
	EmergencyPhoneNumber string `db:"emergency_phone_number"`
	OtherCircles         string `db:"other_circles"`
	Workshops            string `db:"workshops"`
	Squads               string `db:"squads"`

	// 外部サービス
	SlackID sql.NullString `db:"slack_id"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

func newUser(u *domain.User) *user {
	return &user{
		Email:                u.Email,
		Generation:           u.Generation,
		Name:                 u.Name,
		Kana:                 u.Kana,
		Handle:               u.Handle,
		Sex:                  string(u.Sex),
		University:           u.University.Name,
		UniversityDepartment: u.University.Department,
		UniversitySubject:    u.University.Subject,
		StudentID:            u.StudentID,
		EmergencyPhoneNumber: u.EmergencyPhoneNumber,
		OtherCircles:         u.OtherCircles,
		Workshops:            strings.Join(u.Workshops, "\n"),
		Squads:               strings.Join(u.Squads, "\n"),

		SlackID: sql.NullString{
			String: u.SlackID,
			Valid:  len(u.SlackID) != 0,
		},

		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

func convertUser(u *user) *domain.User {
	return &domain.User{
		Email:      u.Email,
		Generation: u.Generation,
		Name:       u.Name,
		Kana:       u.Kana,
		Handle:     u.Handle,
		Sex:        domain.SexType(u.Sex),
		University: &domain.University{
			Name:       u.University,
			Department: u.UniversityDepartment,
			Subject:    u.UniversitySubject,
		},
		StudentID:            u.StudentID,
		EmergencyPhoneNumber: u.EmergencyPhoneNumber,
		OtherCircles:         u.OtherCircles,
		Workshops:            strings.Split(u.Workshops, "\n"),
		Squads:               strings.Split(u.Squads, "\n"),

		SlackID: u.SlackID.String,

		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

type userPersistence struct {
}

var _ repository.UserRepository = &userPersistence{}

// Insert inserts new user to DB
func (up *userPersistence) Insert(db db.Ext, user *domain.User) (int, error) {
	u := newUser(user)

	res, err := sqlx.NamedExec(db, `
	INSERT INTO users (
		email,
		generation,
		name,
		kana,
		handle,
		sex,
		university_name,
		university_department,
		university_subject,
		student_id,
		emergency_phone_number,
		other_circles,
		workshops,
		squads
	) VALUES (
		:email,
		:generation,
		:name,
		:kana,
		:handle,
		:sex,
		:university_name,
		:university_department,
		:university_subject,
		:student_id,
		:emergency_phone_number,
		:other_circles,
		:workshops,
		:squads
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
func (up *userPersistence) GetByID(db db.Ext, id int) (*domain.User, error) {
	var u user
	if err := sqlx.Get(
		db,
		&u,
		`SELECT * FROM users WHERE id=?`,
		id,
	); err != nil {
		return nil, xerrors.Errorf("failed to find user by id: %w", err)
	}

	return convertUser(&u), nil
}

// GetByID finds existing user by user's Slack ID(neither name nor display name)
func (up *userPersistence) GetBySlackID(db db.Ext, slackID string) (*domain.User, error) {
	var u user
	if err := sqlx.Get(
		db,
		&u,
		`SELECT * FROM users WHERE slack_id=?`,
		slackID,
	); err != nil {
		return nil, xerrors.Errorf("failed to find user by Slack ID: %w", err)
	}

	return convertUser(&u), nil
}

// GetByID finds existing user by user's Email
func (up *userPersistence) GetByEmail(db db.Ext, email string) (*domain.User, error) {
	var u user
	if err := sqlx.Get(
		db,
		&u,
		`SELECT * FROM users WHERE email=?`,
		email,
	); err != nil {
		return nil, xerrors.Errorf("failed to find user by Email: %w", err)
	}

	return convertUser(&u), nil
}

// List returns all users
func (up *userPersistence) List(db db.Ext) ([]*domain.User, error) {
	var users []user
	if err := sqlx.Select(
		db,
		&users,
		`SELECT * FROM users`,
	); err != nil {
		return nil, xerrors.Errorf("failed to list users: %w", err)
	}

	res := make([]*domain.User, 0, len(users))

	for i := range res {
		res = append(res, convertUser(&users[i]))
	}

	return res, nil
}

// ListByID - ユーザIDが一致する全てのユーザを取得
func (up *userPersistence) ListByID(db db.Ext, ids []int) ([]*domain.User, error) {
	query, args, err := sqlx.In(`SELECT * FROM users WHERE id IN (?)`, ids)

	if err != nil {
		return nil, xerrors.Errorf("failed to prepare query for IN clause: %w", err)
	}

	var users []user

	if err := sqlx.Select(
		db,
		&users,
		query,
		args...,
	); err != nil {
		return nil, xerrors.Errorf("failed to list users: %w", err)
	}

	res := make([]*domain.User, 0, len(users))

	for i := range res {
		res = append(res, convertUser(&users[i]))
	}

	return res, nil
}
