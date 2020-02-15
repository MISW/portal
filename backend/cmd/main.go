package cmd

import (
	"flag"
	"net/http"
)

var (
	addr = flag.String("addr", ":80", "address to listen on")
)

func Run() {
	http.ListenAndServe(*addr, nil)
}
