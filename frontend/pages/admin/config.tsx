import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Config } from "../../src/components/layout/Config";
import Period from "../../src/components/layout/config/period";
import { usePaymentPeriodConfig, useCurrentPeriodConfig } from "../../src/hooks/appConfig";
import { calcPeriod } from "../../src/util";

const Page: NextPage = () => {
  const [paymentPeriod, setPaymentPeriod] = usePaymentPeriodConfig();
  const [currentPeriod, setCurrentPeriod] = useCurrentPeriodConfig();

  const optionsForPayment = currentPeriod ? [
    currentPeriod, calcPeriod(currentPeriod, 1)
  ] : [];

  const optionsForCurrent = paymentPeriod ? [
    calcPeriod(paymentPeriod, -1), paymentPeriod
  ] : [];
  console.log(optionsForPayment);
  console.log(optionsForCurrent);

  const paymentPeriodConfig = () => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [selected, setSelected] = useState<number | undefined>(paymentPeriod);

    useEffect(() => {
      if (paymentPeriod)
        setSelected(paymentPeriod);
    }, [paymentPeriod]);

    return {
      title: "支払い期間",
      node: (
        <Period
          title="支払い期間"
          description="支払い期間の設定は支払い登録モードにおいて支払いを行う期間の指定です。会員権限の確認に前の期間を利用しつつ次の期間での支払い登録を行い、支払った人も会員と認めることができます。"
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
    }
  };
  const currentPeriodConfig = () => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [selected, setSelected] = useState<number | undefined>(currentPeriod);

    useEffect(() => {
      if (currentPeriod)
        setSelected(currentPeriod);
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
    }
  };

  return (
    <Config configs={[currentPeriodConfig(), paymentPeriodConfig()]}>
    </Config>
  );
};

export default Page;
