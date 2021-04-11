import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Config } from "components/layout/Config";
import Period from "components/layout/config/Period";
import EmailTemplate from "components/layout/config/EmailTemplate";
import {
  usePaymentPeriodConfig,
  useCurrentPeriodConfig,
  useEmailTemplateConfig,
  EmailTemplate as EmailTemplateType,
} from "hooks/appConfig";
import { calcPeriod } from "utils";
import { withLogin } from "middlewares/withLogin";

const usePaymentPeriodNode = (
  paymentPeriod: number | undefined,
  setPaymentPeriod: (period: number) => Promise<void>,
  optionsForPayment: number[]
) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | undefined>(paymentPeriod);

  useEffect(() => {
    if (paymentPeriod) setSelected(paymentPeriod);
  }, [paymentPeriod]);

  return {
    title: "支払い期間",
    node: (
      <Period
        title="支払い期間"
        description="支払い期間の設定は支払い登録モードにおいて支払いを行う期間の指定です。会員権限の確認に現在の期間で指定された期間を利用しつつ支払い期間での支払い登録を行い、支払った人も会員と認めることができます。会費徴収が始まった際には、支払い期間だけを次に進め、会費徴収期間が終了したタイミングで支払い期間を進めることを推奨します。"
        selected={selected}
        setSelected={setSelected}
        options={optionsForPayment}
        onClose={() => {
          setSelected(paymentPeriod);
          setExpanded(false);
        }}
        onSave={async () => {
          setExpanded(false);
          if (selected) await setPaymentPeriod(selected);
        }}
      />
    ),
    expanded,
    setExpanded,
  };
};

const useCurrentPeriodNode = (
  currentPeriod: number | undefined,
  setCurrentPeriod: (period: number) => Promise<void>,
  optionsForCurrent: number[]
) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | undefined>(currentPeriod);

  useEffect(() => {
    if (currentPeriod) setSelected(currentPeriod);
  }, [currentPeriod]);

  return {
    title: "現在の期間",
    node: (
      <Period
        title="現在の期間"
        description="現在の期間の設定はユーザに会員権限があるかの確認に使われます。変更すると、その期間に支払済でないメンバーが自動的に非メンバーとなるため、注意して実行してください。"
        selected={selected}
        setSelected={setSelected}
        options={optionsForCurrent}
        onClose={() => {
          setSelected(currentPeriod);
          setExpanded(false);
        }}
        onSave={async () => {
          setExpanded(false);
          if (selected) await setCurrentPeriod(selected);
        }}
      />
    ),
    expanded,
    setExpanded,
  };
};

const useEmailTemplateNode = () => {
  type KindType =
    | "email_verification"
    | "slack_invitation"
    | "after_registration"
    | "payment_reminder";
  const options: { key: KindType; label: string }[] = [
    { key: "email_verification", label: "Eメール認証" },
    { key: "slack_invitation", label: "Slack招待時の同時送信メール" },
    {
      key: "after_registration",
      label: "メールアドレス確認後の支払い方法案内メール",
    },
    {
      key: "payment_reminder",
      label: "未払いメンバーに対する催促メール",
    },
  ];

  const [expanded, setExpanded] = useState(false);
  const [kind, setKind] = useState<KindType>("email_verification");

  const {
    emailTemplate: remoteEmailTemplate,
    updateEmailTemplate,
  } = useEmailTemplateConfig(kind);
  const [emailTemplate, setEmailTemplate] = useState<
    EmailTemplateType | undefined
  >(remoteEmailTemplate);

  useEffect(() => {
    setEmailTemplate(remoteEmailTemplate);
  }, [remoteEmailTemplate]);

  return {
    title: "メールテンプレート設定",
    node: (
      <EmailTemplate
        selected={kind}
        setSelected={setKind}
        values={emailTemplate ?? { subject: "", body: "" }}
        setValues={setEmailTemplate}
        options={options}
        onClose={() => {
          setEmailTemplate(remoteEmailTemplate);
          setKind("email_verification");

          setExpanded(false);
        }}
        onSave={async () => {
          setExpanded(false);
          if (emailTemplate) await updateEmailTemplate(emailTemplate);
        }}
      />
    ),
    expanded,
    setExpanded,
  };
};

const Page: NextPage = () => {
  const [paymentPeriod, setPaymentPeriod] = usePaymentPeriodConfig();
  const [currentPeriod, setCurrentPeriod] = useCurrentPeriodConfig();

  const optionsForPayment = currentPeriod
    ? [currentPeriod, calcPeriod(currentPeriod, 1)]
    : [];

  const optionsForCurrent = paymentPeriod
    ? [calcPeriod(paymentPeriod, -1), paymentPeriod]
    : [];

  const currentPeriodNode = useCurrentPeriodNode(
    currentPeriod,
    setCurrentPeriod,
    optionsForCurrent
  );
  const PaymentPeriodNode = usePaymentPeriodNode(
    paymentPeriod,
    setPaymentPeriod,
    optionsForPayment
  );
  const emailTemplateNode = useEmailTemplateNode();

  return (
    <Config
      configs={[currentPeriodNode, PaymentPeriodNode, emailTemplateNode]}
    ></Config>
  );
};

export default withLogin(Page);
