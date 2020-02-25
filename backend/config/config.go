package config

import (
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

// Email - Email周りの設定
type Email struct {
	SMTPServer string `json:"smtp_server" yaml:"smtp_server"`
	Username   string `json:"username" yaml:"username"`
	Password   string `json:"password" yaml:"password"`
	From       string `json:"from" yaml:"from"`
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
