TRUNCATE appconfig;
INSERT INTO `appconfig`
(
  `configkey`, `configvalue`, `created_at`, `updated_at`
)
VALUES
(
  'current-period-v1',
  '202304',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
),
(
  'email-template-v1-after_registration',
  '{\"subject\":\"MISW入会費のお支払について\",\"body\":\"{{.User.Handle}}さん\\nMISWへようこそ!\\nみすポータルへのご登録ありがとうございます。\\nMISWへの入会を完了するためには、入会費を指定の銀行口座にお支払いしていただく必要があります。\\n支払いは一ヶ月以内に完了していただくようにお願いいたします。\\n早稲田大学経営情報学会(MISW)\\n\"}',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
),
(
  'email-template-v1-email_verification',
  '{\"subject\":\"メールアドレスを認証してください\",\"body\":\"{{.User.Handle}}さん\\nMISWへようこそ!\\nこのメールは自動送信されています。\\n下記のリンクをクリックしてメール認証を完了してください。\\n{{.VerificationLink}}\\n早稲田大学経営情報学会(MISW)\\n\"}',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
),
(
  'email-template-v1-payment_receipt',
  '{\"subject\":\"会費の支払いを確認しました\",\"body\":\"{{.User.Handle}}さん\\n会費の支払いを確認いたしました。\\n早稲田大学経営情報学会(MISW)\\n\"}',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
),
(
  'email-template-v1-payment_reminder',
  '{\"subject\":\"【重要】MISW会費のお支払について\",\"body\":\"{{.User.Handle}}さん\\nかねてからMISWにご入会していただき誠にありがとうございます。\\nまだ、サークル費の振り込みが確認できていない旨をお知らせさせていただきます。\\nMISWへの会員継続をするには半期のサークル費を指定の銀行口座にお支払いしていただく必要があります。\\n会費を支払わない場合、自動的にサークル退会とみなし、公式Discord・Kibela・みすクラウド等が使用できなくなります。\\nご了承ください。\\n早稲田大学経営情報学会(MISW)\\n\"}',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
),
(
  'payment-period-v1',
  '202304',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
);
