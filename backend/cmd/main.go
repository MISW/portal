package cmd

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/MISW/Portal/backend/config"
	"golang.org/x/net/context"
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

	digc := initDigContainer(cfg, addr)

	handler := initHandler(cfg, addr, digc)

	go func() {
		ch := make(chan os.Signal, 1)
		signal.Notify(ch, syscall.SIGTERM, syscall.SIGHUP, syscall.SIGINT)

		log.Printf("received signal: %v", <-ch)

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()
		handler.Shutdown(ctx)
	}()

	if err := handler.Start(addr); err != nil {
		panic(err)
	}
}
