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

// Config - 各種設定用
type Config struct {
	Database string `json:"database" yaml:"database"`

	OpenIDConnect OpenIDConnect `json:"oidc" yaml:"oidc"`
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

	return cfg, nil
}
