package cmd

import (
	"os"

	"github.com/MISW/Portal/backend/config"
	"github.com/labstack/echo/v4"
)

// Run - エントリーポイント
func Run() {
	configName, ok := os.LookupEnv("PORTAL_CONFIG")
	if !ok {
		configName = "./portal.yaml"
	}

	cfg, err := config.ReadConfig(configName)

	if err != nil {
		panic(err)
	}

	addr, ok := os.LookupEnv("PORT")

	if !ok {
		addr = "80"
	}
	addr = ":" + addr

	initHandler(cfg, addr)
}
