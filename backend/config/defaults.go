package config

var (
	defaultConfig = &Config{}
)

func newDefaultConfig() *Config {
	cfg := *defaultConfig

	return &cfg
}
