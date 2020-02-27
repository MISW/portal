package config

import (
	"html/template"
	"io"
	"os"
	"strings"

	"golang.org/x/xerrors"
	"gopkg.in/yaml.v2"
)

// OpenIDConnect - Auth0のOpenID Connectの認証設定
type OpenIDConnect struct {
	ClientID     string `json:"client_id" yaml:"client_id"`
	ClientSecret string `json:"client_secret" yaml:"client_secret"`
	RedirectURL  string `json:"redirect_url" yaml:"redirect_url"`
	ProviderURL  string `json:"provider_url" yaml:"provider_url"`
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

// EmailTemplate - Email本文のフォーマット設定
type EmailTemplateBase struct {
	Subject string `json:"subject" yaml:"subject"`
	Body    string `json:"body" yaml:"body"`
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
	EmailVerification EmailTemplateBase `json:"email_verification" yaml:"email_verification"`
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
	SMTPServer string `json:"smtp_server" yaml:"smtp_server"`
	Username   string `json:"username" yaml:"username"`
	Password   string `json:"password" yaml:"password"`
	From       string `json:"from" yaml:"from"`

	Templates struct {
		// EmailVerification - 登録時のメール送信
		EmailVerification EmailTemplate `json:"email_verification" yaml:"email_verification"`
	} `json:"templates" yaml:"templates"`
}

// Config - 各種設定用
type Config struct {
	Database string `json:"database" yaml:"database"`

	OpenIDConnect OpenIDConnect `json:"oidc" yaml:"oidc"`
	Email         Email         `json:"email" yaml:"email"`
}

// ReadConfig - configを読み込む
func ReadConfig(name string) (*Config, error) {
	var reader io.Reader

	if strings.HasPrefix(name, "env://") {
		reader = strings.NewReader(os.Getenv(strings.TrimPrefix(name, "env://")))
	} else {
		fp, err := os.Open(name)

		if err != nil {
			return nil, xerrors.Errorf("failed to read config: %w", err)
		}

		reader = fp
		defer fp.Close()
	}

	cfg := &Config{}

	err := yaml.NewDecoder(reader).Decode(cfg)

	if err != nil {
		return nil, xerrors.Errorf("failed to parse config: %w", err)
	}

	if cfg.Database == "" {
		cfg.Database = os.Getenv("DATABASE_URL")
	}

	if cfg.OpenIDConnect.RedirectURL == "" {
		cfg.OpenIDConnect.RedirectURL = os.Getenv("OIDC_REDIRECT_URL")
	}
	if cfg.OpenIDConnect.ClientID == "" {
		cfg.OpenIDConnect.ClientID = os.Getenv("OIDC_CLIENT_ID")
	}
	if cfg.OpenIDConnect.ClientSecret == "" {
		cfg.OpenIDConnect.ClientSecret = os.Getenv("OIDC_CLIENT_SECRET")
	}
	if cfg.OpenIDConnect.ProviderURL == "" {
		cfg.OpenIDConnect.ProviderURL = os.Getenv("OIDC_PROVIDER_URL")
	}

	if cfg.Email.SMTPServer == "" {
		cfg.Email.SMTPServer = os.Getenv("SMTP_SERVER")
	}
	if cfg.Email.Username == "" {
		cfg.Email.Username = os.Getenv("SMTP_USERNAME")
	}
	if cfg.Email.Password == "" {
		cfg.Email.Password = os.Getenv("SMTP_PASSWORD")
	}
	if cfg.Email.From == "" {
		cfg.Email.From = os.Getenv("SMTP_FROM")
	}

	return cfg, nil
}
