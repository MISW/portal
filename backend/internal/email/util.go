package email

import (
	"bytes"
	"encoding/base64"
)

func splitInLength(m string, l int) []string {
	res := make([]string, 0, (len(m)+l-1)/l)

	msg := []rune(m)

	for i := 0; i < len(msg); i += l {
		idx := i + l

		if idx > len(msg) {
			idx = len(msg)
		}

		res = append(res, string(msg[i:idx]))
	}

	return res
}

func encodeSubject(subject string) string {
	var buffer bytes.Buffer
	buffer.WriteString("Subject:")
	for _, line := range splitInLength(subject, 13) {
		buffer.WriteString(" =?utf-8?B?")
		buffer.WriteString(base64.StdEncoding.EncodeToString([]byte(line)))
		buffer.WriteString("?=\r\n")
	}
	return buffer.String()
}
