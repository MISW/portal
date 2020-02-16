package cmd

import (
	"flag"
	"net/http"
)

var (
	addr = flag.String("addr", ":80", "address to listen on")
)

// Run - エントリーポイント
func Run() {
	flag.Parse()

	http.ListenAndServe(*addr, nil)
}
