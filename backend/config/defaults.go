package config

var (
	defaultConfig = &Config{
		BaseURL: "http://localhost:10080/",
	}
)

func newDefaultConfig() *Config {
	cfg := *defaultConfig

	return &cfg
}
