package email

import (
	"bytes"
	"html/template"

	"golang.org/x/xerrors"
)

// GenerateEmailFromTemplate - templateエンジンを利用してメールbodyとsubjectを生成
func GenerateEmailFromTemplate(subjectTemplateStr, bodyTemplateStr string, param interface{}) (subject, body string, err error) {
	subjectTemplate, err := template.New("").Parse(subjectTemplateStr)

	if err != nil {
		return "", "", xerrors.Errorf("failed to parse subject template: %w", err)
	}

	bodyTemplate, err := template.New("").Parse(bodyTemplateStr)

	if err != nil {
		return "", "", xerrors.Errorf("failed to parse body template: %w", err)
	}

	s := bytes.NewBuffer(nil)
	b := bytes.NewBuffer(nil)

	if err := subjectTemplate.Execute(s, param); err != nil {
		return "", "", xerrors.Errorf("failed to execute the template for the subject: %w", err)
	}
	if err := bodyTemplate.Execute(b, param); err != nil {
		return "", "", xerrors.Errorf("failed to execute the template for the body: %w", err)
	}

	return s.String(), b.String(), nil
}
