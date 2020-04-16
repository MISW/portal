package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"

	"github.com/slack-go/slack"
)

var (
	userMap = map[string]*user{}
)

type user struct {
	Name string
	CSV  []string
}

func loadCSV() {
	if len(os.Args) < 2 {
		fmt.Printf("[%s] [path to csv]\n", os.Args[0])

		os.Exit(1)
	}

	fp, err := os.Open(os.Args[1])

	if err != nil {
		panic(err)
	}
	defer fp.Close()

	reader := csv.NewReader(fp)
	for {
		columns, err := reader.Read()

		if err == io.EOF {
			break
		}

		if err != nil {
			panic(err)
		}

		if _, ok := userMap[columns[11]]; !ok {
			userMap[columns[11]] = &user{}
		}

		userMap[columns[11]].CSV = columns
	}
}

func main() {
	loadCSV()

	client := slack.New(os.Getenv("SLACK_TOKEN"), slack.OptionDebug(true))

	users, err := client.GetUsers()

	if err != nil {
		panic(err)
	}

	for i := range users {
		if users[i].Deleted {
			continue
		}
		if users[i].IsBot {
			continue
		}

		if _, ok := userMap[users[i].ID]; !ok {
			userMap[users[i].ID] = &user{}
		}

		userMap[users[i].ID].Name = users[i].Name
	}

	fp, err := os.Create("output.csv")

	if err != nil {
		panic(err)
	}
	defer fp.Close()

	encoder := csv.NewWriter(fp)

	for k, v := range userMap {
		if len(v.CSV) == 0 {
			v.CSV = make([]string, 16)
		}
		v.CSV[11] = k

		encoder.Write(append(v.CSV, v.Name))
	}
	encoder.Flush()
}
