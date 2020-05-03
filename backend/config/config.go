package config

import (
	"context"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"strings"

	"github.com/heetch/confita"
	"github.com/heetch/confita/backend"
	"github.com/heetch/confita/backend/file"
	"golang.org/x/xerrors"
)

// OpenIDConnect - Auth0のOpenID Connectの認証設定
type OpenIDConnect struct {
	ClientID     string `config:"oidc-client-id" json:"client_id" yaml:"client_id"`
	ClientSecret string `config:"oidc-client-secret" json:"client_secret" yaml:"client_secret"`
	RedirectURL  string `config:"oidc-redirect-url" json:"redirect_url" yaml:"redirect_url"`
	ProviderURL  string `config:"oidc-provider-url" json:"provider_url" yaml:"provider_url"`
}

// EmailTemplate - Email本文のフォーマット設定
type EmailTemplate struct {
	Subject string `config:"-" json:"subject" yaml:"subject"`
	Body    string `config:"-" json:"body" yaml:"body"`

	SubjectTemplate *template.Template `config:"-"`
	BodyTeamplte    *template.Template `config:"-"`
}

func (b *EmailTemplate) parse() error {
	subj, err := template.New("").Parse(b.Subject)

	if err != nil {
		return xerrors.Errorf("failed to parse subjet: %w", err)
	}

	body, err := template.New("").Parse(b.Body)

	if err != nil {
		return xerrors.Errorf("failed to parse subjet: %w", err)
	}

	b.SubjectTemplate = subj
	b.BodyTeamplte = body

	return nil
}

// EmailTemplates - Emailのテンプレート(テンプレートエンジン用)
type EmailTemplates struct {
	// EmailVerification - 登録時のメール送信
	EmailVerification *EmailTemplate
}

func (b *EmailTemplates) parse() error {
	err := b.EmailVerification.parse()

	if err != nil {
		return xerrors.Errorf("failed to generate template for email verification: %w", err)
	}

	return nil
}

// Email - Email周りの設定
type Email struct {
	SMTPServer string `config:"smtp_server" json:"smtp_server" yaml:"smtp_server"`
	Username   string `config:"smtp_username" json:"username" yaml:"username"`
	Password   string `config:"smtp_password" json:"password" yaml:"password"`
	From       string `config:"smtp_from" json:"from" yaml:"from"`

	Templates EmailTemplates `json:"templates" yaml:"templates"`
}

// Config - 各種設定用
type Config struct {
	Database           string `config:"database-url" json:"database" yaml:"database"`
	BaseURL            string `config:"base-url" json:"base_url" yaml:"base_url"`
	JWTKey             string `config:"jwt-key" json:"jwt_key" yaml:"jwt_key"`
	SlackToken         string `config:"slack-token" json:"slack_token" yaml:"slack_token"`
	SlackSigningSecret string `config:"slack-signing-secret" json:"slack_signing_secret" yaml:"slack_signing_secret"`
	SlackTeamID        string `config:"slack-team-id" json:"slack_team_id" yaml:"slack_team_id"`

	OpenIDConnect OpenIDConnect `json:"oidc" yaml:"oidc"`
	Email         Email         `json:"email" yaml:"email"`
}

// NewBackend creates a configuration loader that loads from the environment.
// If the key is not found, this backend tries again by turning any kebabcase key to snakecase and
// lowercase letters to uppercase.
func NewBackend() backend.Backend {
	return backend.Func("env", func(ctx context.Context, key string) ([]byte, error) {
		if val := os.Getenv(key); val != "" {
			return []byte(val), nil
		}
		key = strings.Replace(strings.ToUpper(key), "-", "_", -1)
		fmt.Println(key)
		if val := os.Getenv(key); val != "" {
			return []byte(val), nil
		}
		return nil, backend.ErrNotFound
	})
}

// ReadConfig - configを読み込む
func ReadConfig() (*Config, error) {

	fmt.Println(strings.Join(os.Environ(), "\n"))
	var bs []backend.Backend = []backend.Backend{
		NewBackend(),
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

	if err := cfg.Email.Templates.parse(); err != nil {
		return nil, xerrors.Errorf("failed to load templates: %w", err)
	}

	return cfg, nil
}
