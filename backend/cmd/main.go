package cmd

import (
	"os"

	"github.com/MISW/Portal/backend/config"
)

// Run - エントリーポイント
func Run() {
	cfg, err := config.ReadConfig()

	if err != nil {
		panic(err)
	}

	addr, ok := os.LookupEnv("PORT")

	if !ok {
		addr = "80"
	}
	addr = ":" + addr

	handler := initHandler(cfg, addr)

	if err := handler.Start(addr); err != nil {
		panic(err)
	}
}
