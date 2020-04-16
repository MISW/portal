package main

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

var (
	query = `
INSERT INTO users (
	email,
	generation,
	name,
	kana,
	handle,
	sex,
	university_name,
	university_department,
	university_subject,
	student_id,
	emergency_phone_number,
	other_circles,
	workshops,
	squads,
	role,
	slack_id
) VALUES (
	?,
	?,
	?,
	?,
	?,
	?,
	?,
	?,
	?,
	?,
	?,
	?,
	?,
	?,
	?,
	?
)`
)

//代,苗字,名前,セイ,メイ,性別,ハンネ,大学,学部,学科,学籍番号,slackID,メールアドレス,研究会,班,電話番号
/*
0: 代
1: 苗字
2: 名前
3: セイ
4: メイ
5: 性別
6: ハンネ
7: 大学
8: 学部
9: 学科
10: 学籍番号
11: slackID
12: メールアドレス
13: 研究会
14: 班
15: 電話番号
*/
func main() {
	if len(os.Args) < 2 {
		fmt.Printf("[%s] [path to csv]", os.Args[0])

		return
	}

	fp, err := os.Open(os.Args[1])

	if err != nil {
		panic(err)
	}
	defer fp.Close()

	conn, err := sql.Open("mysql", os.Getenv("DSN"))

	if err != nil {
		panic(err)
	}
	defer conn.Close()

	reader := csv.NewReader(fp)
	for {
		columns, err := reader.Read()

		if err == io.EOF {
			break
		}

		if err != nil {
			panic(err)
		}
		if len(columns) == 0 {
			break
		}

		gen, err := strconv.Atoi(columns[0])

		if err != nil {
			panic(err)
		}

		var sex string
		if columns[5] == "女" {
			sex = "female"
		} else if columns[5] == "男" {
			sex = "male"
		} else {
			panic("unknown sex: " + columns[5])
		}

		workshops := strings.Split(columns[13], " ")

		if len(columns[13]) == 0 {
			workshops = []string{"プログラミング", "CG", "MIDI"}
		}

		for i := range workshops {
			workshops[i] = strings.Trim(workshops[i], ",")

			w := workshops[i]
			if w != "プログラミング" &&
				w != "CG" &&
				w != "MIDI" {
				panic("illegal workshop: " + w)
			}
		}

		role := "member"

		if gen <= 52 { // TO BE UPDATED!
			role = "retired"
		}

		_, err = conn.Exec(
			query,
			columns[12],
			gen,
			columns[1]+" "+columns[2],
			columns[3]+" "+columns[4],
			columns[6],
			sex,
			columns[7],
			columns[8],
			columns[9],
			columns[10],
			strings.ReplaceAll(columns[15], "-", ""),
			"",
			strings.Join(workshops, "\n"),
			columns[14],
			role,
			columns[11],
		)

		if err != nil {
			panic(err)
		}
	}
}
