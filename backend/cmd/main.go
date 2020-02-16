package cmd

import (
	"net/http"
	"os"
)

// Run - エントリーポイント
func Run() {
	addr, ok := os.LookupEnv("PORT")

	if !ok {
		addr = "80"
	}
	addr = ":" + addr

	http.ListenAndServe(addr, nil)
}
