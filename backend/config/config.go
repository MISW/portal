package config

import (
	"context"
	"fmt"
	"html/template"
	"os"
	"strings"

	"github.com/heetch/confita/backend"
	"golang.org/x/xerrors"
	"honnef.co/go/tools/config"
)

// OpenIDConnect - Auth0のOpenID Connectの認証設定
type OpenIDConnect struct {
	ClientID     string `json:"client_id" yaml:"client_id" toml:"client_id"`
	ClientSecret string `json:"client_secret" yaml:"client_secret" toml:"client_secret"`
	RedirectURL  string `json:"redirect_url" yaml:"redirect_url" toml:"redirect_url"`
	ProviderURL  string `json:"provider_url" yaml:"provider_url" toml:"provider_url"`
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
	Subject string `json:"subject" yaml:"subject" toml:"subject"`
	Body    string `json:"body" yaml:"body" toml:"body"`
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
	EmailVerification EmailTemplateBase `json:"email_verification" yaml:"email_verification" toml:"email_verification"`
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
	SMTPServer string `json:"smtp_server" yaml:"smtp_server" toml:"smtp_server"`
	Username   string `json:"username" yaml:"username" toml:"username"`
	Password   string `json:"password" yaml:"password" toml:"password"`
	From       string `json:"from" yaml:"from" toml:"from"`

	Templates EmailTemplateBase `json:"templates" yaml:"templates" toml:"templates"`
}

// Config - 各種設定用
type Config struct {
	Database string `json:"database" yaml:"database" toml:"database"`

	OpenIDConnect OpenIDConnect `json:"oidc" yaml:"oidc" toml:"oidc"`
	Email         Email         `json:"email" yaml:"email" toml:"email"`
}

// NewBackend creates a configuration loader that loads from the environment.
// If the key is not found, this backend tries again by turning any kebabcase key to snakecase and
// lowercase letters to uppercase.
func NewBackend() backend.Backend {
	return backend.Func("env", func(ctx context.Context, key string) ([]byte, error) {
		fmt.Println(key)
		if val := os.Getenv(key); val != "" {
			return []byte(val), nil
		}
		key = strings.Replace(strings.ToUpper(key), "-", "_", -1)
		if val := os.Getenv(key); val != "" {
			return []byte(val), nil
		}
		return nil, backend.ErrNotFound
	})
}

// ReadConfig - configを読み込む
func ReadConfig(name string) (*Config, error) {

	cfg := newDefaultConfig()

	err := config.Load(cfg)

	if err != nil {
		return nil, xerrors.Errorf("failed to load config: %w", err)
	}

	return cfg, nil
}
