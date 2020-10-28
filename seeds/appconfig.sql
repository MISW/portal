TRUNCATE appconfig;
INSERT INTO `appconfig` VALUES
    ('current-period-v1','202004','2020-06-15 07:19:30','2020-06-15 07:19:30'),
    ('email-template-v1-after_registration','{\"subject\":\"MISWの入会費をお支払いください\",\"body\":\"{{.User.Handle}}さん\\nMISWへようこそ！\\n\\nMISW Portalへの登録ありがとうございました。\"}','2020-05-12 16:20:38','2020-05-12 16:20:38'),
    ('email-template-v1-email_verification','{\"subject\":\"メールアドレスの認証を完了してください\",\"body\":\"MISWへようこそ！\\nこのメールは自動送信されています。\\n下記のリンクをクリックしてメール認証を完了してください。\\n\\n{{.VerificationLink}}\\n\\n経営情報学会(MISW)\"}','2020-05-08 04:31:32','2020-05-13 10:16:20'),
    ('email-template-v1-payment_reminder','{\"subject\":\"【重要】MISW春会費納入期限について\",\"body\":\"{{.User.Handle}}さん\\nかねてからMISWに入会していただき誠にありがとうございます。サークル費払って！！！！\"}','2020-05-29 15:10:47','2020-05-30 03:06:46'),
    ('email-template-v1-slack_invitation','{\"subject\":\"Slackへの招待を確認してください\",\"body\":\"{{.User.Handle}}さん、初めまして。MISWへようこそ！\\n\\n入会費の払込が確認できたため, 会員登録が完了しました！\"}','2020-05-12 16:13:48','2020-05-13 07:47:47'),
    ('payment-period-v1','202010','2020-09-16 07:54:09','2020-09-16 07:54:09');
