TRUNCATE appconfig;
INSERT INTO `appconfig`
VALUES
(
  'current-period-v1',
  '202204',
  '2022-04-01 00:00:00',
  '2022-04-01 00:00:00'),
(
  'email-template-v1-after_registration',
  '{\"subject\":\"MISWの入会費をお支払いください\",\"body\":\"{{.User.Handle}}さん\\nMISWへようこそ！\\n\\nMISW Portalへの登録ありがとうございました。\"}',
  '2022-04-01 00:00:00',
  '2022-04-01 00:00:00'
),
(
  'email-template-v1-email_verification',
  '{\"subject\":\"メールアドレスの認証を完了してください\",\"body\":\"MISWへようこそ！\\nこのメールは自動送信されています。\\n下記のリンクをクリックしてメール認証を完了してください。\\n\\n{{.VerificationLink}}\\n\\n経営情報学会(MISW)\"}',
  '2022-04-01 00:00:00',
  '2022-04-01 00:00:00'
),
(
  'email-template-v1-payment_reminder',
  '{\"subject\":\"【重要】MISW春会費納入期限について\",\"body\":\"{{.User.Handle}}さん\\nかねてからMISWに入会していただき誠にありがとうございます。サークル費払って！！！！\"}',
  '2022-04-01 00:00:00',
  '2022-04-01 00:00:00'
),
(
  'payment-period-v1',
  '202210',
  '2022-04-01 00:00:00',
  '2022-04-01 00:00:00'
);
