package config

var (
	emailVerificationSubject = "メールアドレスの認証を完了してください"
	emailVerificationBody    = `MISWへようこそ！
このメールは自動送信されています。

下記のリンクをクリックして登録を完了してください。
不明点などがあればサークル員にお気軽にお尋ねください！

{{.VerificationLink}}

経営情報学会(MISW)
`

	defaultConfig = &Config{
		Email: Email{
			Templates: EmailTemplates{
				EmailVerification: EmailTemplate{
					Subject: emailVerificationSubject,
					Body:    emailVerificationBody,
				},
			},
		},
	}
)

func newDefaultConfig() *Config {
	cfg := *defaultConfig

	return &cfg
}
