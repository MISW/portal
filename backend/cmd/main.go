package cmd

import (
	"net/http"
	"os"
)

func Run() {
	http.ListenAndServe(":"+os.Getenv("PORT"), nil)
}
