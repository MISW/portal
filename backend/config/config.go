package config

import (
	"fmt"
	"os"

	"github.com/caarlos0/env/v9"
	"golang.org/x/xerrors"
)

// OpenIDConnect - Auth0のOpenID Connectの認証設定
type OpenIDConnect struct {
	ClientID     string `env:"OIDC_CLIENT_ID"`
	ClientSecret string `env:"OIDC_CLIENT_SECRET"`
	RedirectURL  string `env:"OIDC_REDIRECT_URL"`
	ProviderURL  string `env:"OIDC_PROVIDER_URL"`
}

// Email - Email周りの設定
type Email struct {
	SMTPServer string `env:"SMTP_SERVER"`
	SMTPPort   string `env:"SMTP_PORT" envDefault:"587"`
	Username   string `env:"SMTP_USERNAME"`
	Password   string `env:"SMTP_PASSWORD"`
	From       string `env:"SMTP_FROM"`
}

// Config - 各種設定用
type Config struct {
	Database                  string   `env:"DATABASE_URL"`
	BaseURL                   string   `env:"BASE_URL" envDefault:"http://localhost:10080/"`
	JWTKey                    string   `env:"JWT_KEY"`
	ExternalIntegrationTokens []string `env:"EXTERNAL_INTEGRATION_TOKENS"`

	OpenIDConnect OpenIDConnect
	Email         Email
}

func ReadConfig() (*Config, error) {
	var cfg Config

	err := env.Parse(&cfg)
	if err != nil {
		return nil, xerrors.Errorf("failed to perse config: %w", err)
	}

	err = env.Parse(&cfg.OpenIDConnect)
	if err != nil {
		return nil, xerrors.Errorf("failed to perse config: %w", err)
	}

	err = env.Parse(&cfg.Email)
	if err != nil {
		return nil, xerrors.Errorf("failed to perse config: %w", err)
	}

	if os.Getenv("DEBUG_MODE") == "1" {
		fmt.Println(cfg)
	}

	return &cfg, err
}
