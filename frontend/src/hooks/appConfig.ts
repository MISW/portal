import { useState, useEffect, useCallback } from "react";

export type PeriodConfigState = () => [
  number | undefined,
  (period: number) => Promise<void>
];

export const usePaymentPeriodConfig: PeriodConfigState = () => {
  const [paymentPeriod, setPaymentPeriod] = useState<number>();

  const get = useCallback(async () => {
    const resp = await fetch(
      "/api/private/management/config?kind=payment_period"
    );
    const json = await resp.json();

    if (Math.floor(json.status_code / 100) !== 2) {
      throw new Error("支払い期間の取得に失敗しました: " + json.message);
    }

    setPaymentPeriod(json.payment_period);
  }, [setPaymentPeriod]);

  const update = useCallback(
    async (paymentPeriod: number) => {
      const resp = await fetch("/api/private/management/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "payment_period",
          payload: {
            payment_period: paymentPeriod,
          },
        }),
      });

      const json = await resp.json();

      if (Math.floor(json.status_code / 100) !== 2) {
        throw new Error("支払い期間の更新に失敗しました: " + json.message);
      }

      await get();
    },
    [get]
  );

  useEffect(() => {
    get().catch((x) => console.error(x));
  }, [get]);

  return [paymentPeriod, update];
};

export const useCurrentPeriodConfig: PeriodConfigState = () => {
  const [currentPeriod, setCurrentPeriod] = useState<number>();

  const get = useCallback(async () => {
    const resp = await fetch(
      "/api/private/management/config?kind=current_period"
    );
    const json = await resp.json();

    if (Math.floor(json.status_code / 100) !== 2) {
      throw new Error("現在の期間の取得に失敗しました: " + json.message);
    }

    setCurrentPeriod(json.current_period);
  }, [setCurrentPeriod]);

  const update = useCallback(
    async (currentPeriod: number) => {
      const resp = await fetch("/api/private/management/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "current_period",
          payload: {
            current_period: currentPeriod,
          },
        }),
      });

      const json = await resp.json();

      if (Math.floor(json.status_code / 100) !== 2) {
        throw new Error("現在の期間の更新に失敗しました: " + json.message);
      }

      await get();
    },
    [get]
  );

  useEffect(() => {
    get().catch((x) => console.error(x));
  }, [get]);

  return [currentPeriod, update];
};

export type emailTemplate = { subject: string; body: string };

export function useEmailTemplateConfig(
  _kind: string
): [
  emailTemplate,
  (k: string) => void,
  (subject: string, body: string) => Promise<void>
] {
  const [kind, setKind] = useState<string>(_kind);
  const [template, setTemplate] = useState<emailTemplate>({
    subject: "",
    body: "",
  });

  const get = useCallback(async () => {
    const resp = await fetch(
      "/api/private/management/config?kind=email_template&email_kind=" + kind
    );
    const json = await resp.json();

    if (Math.floor(json.status_code / 100) !== 2) {
      throw new Error(
        "Eメールテンプレートの取得に失敗しました: " + json.message
      );
    }

    setTemplate({ subject: json.subject, body: json.body });
  }, [kind, setTemplate]);

  const update = useCallback(
    async (subject: string, body: string) => {
      const resp = await fetch("/api/private/management/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "email_template",
          payload: {
            email_kind: kind,
            subject,
            body,
          },
        }),
      });

      const json = await resp.json();

      if (Math.floor(json.status_code / 100) !== 2) {
        throw new Error(
          "Eメールテンプレートの更新に失敗しました: " + json.message
        );
      }

      await get();
    },
    [get, kind]
  );

  useEffect(() => {
    get().catch((x) => console.error(x));
  }, [get, kind]);

  return [template, setKind, update];
}
