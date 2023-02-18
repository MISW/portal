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
  '{"subject":"MISWの入会費をお支払いください","body":"{{.User.Handle}}さん\\nMISWへようこそ!\\nMISW Portalへの登録ありがとうございました。\\nMISWへの入会を完了するには入会費を銀行振込にてお支払いいただく必要があります。\\n支払いは一ヶ月以内に完了していただくようお願いいたします。\\n経営情報学会(MISW)\\n"}',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
),
(
  'email-template-v1-email_verification',
  '{"subject":"メールアドレスの認証を完了してください","body":"MISWへようこそ!\\nこのメールは自動送信されています。\\n下記のリンクをクリックしてメール認証を完了してください。\\n{{.VerificationLink}}\\n経営情報学会(MISW)\\n"}',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
),
(
  'email-template-v1-payment_receipt',
  '{"subject":"会費支払いを確認しました","body":"{{.User.Handle}}さん\\n会費支払いを確認しました。\\n"}',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
),
(
  'email-template-v1-payment_reminder',
  '{"subject":"【重要】MISW秋会費納入期限について","body":"{{.User.Handle}}さん\\nかねてからMISWに入会していただき誠にありがとうございます。\\nまだ、サークル費の振り込みが確認できていない旨をお知らせさせていただきます。\\nMISWへの会員継続をするには半期のサークル費(1500円)を銀行振込にてお支払いいただく必要があります。\\n会費を支払わない場合、自動的にサークル退会とみなしSlack、Kibela、公式Discord等が使用できなくなります。ご了承ください。\\n"}',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
),
(
  'payment-period-v1',
  '202304',
  '2023-04-01 00:00:00',
  '2023-04-01 00:00:00'
);
