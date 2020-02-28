package config

import (
	"context"
	"html/template"
	"os"
	"path/filepath"

	"github.com/heetch/confita"
	"github.com/heetch/confita/backend"
	"github.com/heetch/confita/backend/env"
	"github.com/heetch/confita/backend/file"
	"golang.org/x/xerrors"
)

// OpenIDConnect - Auth0のOpenID Connectの認証設定
type OpenIDConnect struct {
	ClientID     string `config:"oifc_client_id"`
	ClientSecret string `config:"oifc_client_secret"`
	RedirectURL  string `config:"oifc_redirect_url"`
	ProviderURL  string `config:"oifc_provider_url"`
}

// EmailTemplate - Emailのテンプレート
type EmailTemplate struct {
	Subject *template.Template `json:"subject" yaml:"subject"`
	Body    *template.Template `json:"body" yaml:"body"`
}

// EmailTemplates - Emailのテンプレートたち
type EmailTemplates struct {
	// EmailVerification - 登録時のメール送信
	EmailVerification *EmailTemplate `json:"email_verification" yaml:"email_verification"`
}

// EmailTemplateBase - Email本文のフォーマット設定
type EmailTemplateBase struct {
	Subject string `config:"-"`
	Body    string `config:"-"`
}

func (b *EmailTemplateBase) parse() (*EmailTemplate, error) {
	subj, err := template.New("").Parse(b.Subject)

	if err != nil {
		return nil, xerrors.Errorf("failed to parse subjet: %w", err)
	}

	body, err := template.New("").Parse(b.Body)

	if err != nil {
		return nil, xerrors.Errorf("failed to parse subjet: %w", err)
	}

	return &EmailTemplate{
		Subject: subj,
		Body:    body,
	}, nil
}

// EmailTemplatesBase - Emailのテンプレート(テンプレートエンジン用)
type EmailTemplatesBase struct {
	// EmailVerification - 登録時のメール送信
	EmailVerification EmailTemplateBase
}

func (b *EmailTemplatesBase) parse() (*EmailTemplates, error) {
	et, err := b.EmailVerification.parse()

	if err != nil {
		return nil, xerrors.Errorf("failed to parse email verification template: %w", err)
	}

	return &EmailTemplates{
		EmailVerification: et,
	}, nil
}

// Email - Email周りの設定
type Email struct {
	SMTPServer string `config:"smtp_server"`
	Username   string `config:"smtp_username"`
	Password   string `config:"smtp_password"`
	From       string `config:"smtp_from"`

	Templates EmailTemplateBase
}

// Config - 各種設定用
type Config struct {
	Database string `config:"database-url"`

	OpenIDConnect OpenIDConnect
	Email         Email
}

// ReadConfig - configを読み込む
func ReadConfig(name string) (*Config, error) {
	var bs []backend.Backend = []backend.Backend{
		env.NewBackend(),
		file.NewOptionalBackend("/etc/portal/portal.yml"),
	}
	if home, err := os.UserHomeDir(); err == nil {
		bs = append(bs, file.NewOptionalBackend(filepath.Join(home, ".config", "portal.yml")))
	}
	if wd, err := os.Getwd(); err == nil {
		bs = append(bs, file.NewOptionalBackend(filepath.Join(wd, "portal.yml")))
	}

	cfg := newDefaultConfig()
	loader := confita.NewLoader(bs...)

	err := loader.Load(context.Background(), cfg)

	if err != nil {
		return nil, xerrors.Errorf("failed to load config: %w", err)
	}

	return cfg, nil
}
