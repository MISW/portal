package config

import (
	"os"
	"strings"
	"testing"

	"github.com/google/go-cmp/cmp"
)

var (
	envTemplate = `PORTAL_CONFIG=env://PORTAL_CONFIG_YAML
PORTAL_CONFIG_YAML={}
OIDC_CLIENT_ID=client_id
OIDC_CLIENT_SECRET=client_secret
OIDC_PROVIDER_URL=https://misw.auth0.com/
OIDC_REDIRECT_URL=http://localhost:10080/callback
SMTP_SERVER=mis-w.sakura.ne.jp
SMTP_PORT=587
SMTP_USERNAME=noreply@misw.jp
SMTP_PASSWORD=password
SMTP_FROM=noreply@misw.jp
DATABASE_URL=mysql://root:root@mysql:3306/portal
PORT=10080
INSECURE_COOKIE=true`

	envExpectedConfig *Config
)

func init() {
	envExpectedConfig = newDefaultConfig()

	envExpectedConfig.Database = "mysql://root:root@mysql:3306/portal"

	envExpectedConfig.OpenIDConnect = OpenIDConnect{
		ClientID:     "client_id",
		ClientSecret: "client_secret",
		ProviderURL:  "https://misw.auth0.com/",
		RedirectURL:  "http://localhost:10080/callback",
	}

	envExpectedConfig.Email = Email{
		SMTPServer: "mis-w.sakura.ne.jp",
		SMTPPort:   "587",
		Username:   "noreply@misw.jp",
		Password:   "password",
		From:       "noreply@misw.jp",
	}

}

func TestLoadConfigFromEnv(t *testing.T) {
	for _, line := range strings.Split(envTemplate, "\n") {
		keyvalue := strings.SplitN(line, "=", 2)

		os.Setenv(keyvalue[0], keyvalue[1])
	}

	cfg, err := ReadConfig()

	if err != nil {
		t.Fatal("failed to load config: %w", err)
	}

	if diff := cmp.Diff(cfg, envExpectedConfig); diff != "" {
		t.Errorf("config does not match: expected: %v actual: %v", *envExpectedConfig, *cfg)
	}
}
