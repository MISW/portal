import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPaymentPeriod,
  fetchPaymentPeriod,
  updatePaymentPeriod,
  selectCurrentPeriod,
  fetchCurrentPeriod,
  updateCurrentPeriod,
  selectEmailTemplateOf,
  fetchEmailTemplate,
  updateEmailTemplate,
} from "features/appconfig";
import { EmailKind } from "models/appconfig";

export type PeriodConfigState = () => [
  number | undefined,
  (period: number) => Promise<void>
];

export const usePaymentPeriodConfig: PeriodConfigState = () => {
  const dispatch = useDispatch();
  const paymentPeriod = useSelector(selectPaymentPeriod);
  useEffect(() => {
    dispatch(fetchPaymentPeriod());
  }, [dispatch]);

  const update = useCallback(
    async (newPaymentPeriod: number) => {
      try {
        await dispatch(updatePaymentPeriod(newPaymentPeriod));
      } catch (e) {
        console.error(e);
        throw new Error("支払い期間の更新に失敗しました: " + e.message);
      }
    },
    [dispatch]
  );

  return [paymentPeriod, update];
};

export const useCurrentPeriodConfig: PeriodConfigState = () => {
  const dispatch = useDispatch();
  const currentPeriod = useSelector(selectCurrentPeriod);
  useEffect(() => {
    dispatch(fetchCurrentPeriod());
  }, [dispatch]);

  const update = useCallback(
    async (newCurrentPeriod: number) => {
      try {
        await dispatch(updateCurrentPeriod(newCurrentPeriod));
      } catch (e) {
        throw new Error("現在の期間の更新に失敗しました: " + e.message);
      }
    },
    [dispatch]
  );

  return [currentPeriod, update];
};

export type emailTemplate = { subject: string; body: string };

export function useEmailTemplateConfig(
  initialKind: EmailKind
): [
  emailTemplate,
  (k: EmailKind) => void,
  (subject: string, body: string) => Promise<void>
] {
  const dispatch = useDispatch();
  const [kind, setKind] = useState<EmailKind>(initialKind);
  const template = useSelector(selectEmailTemplateOf(kind)) ?? {
    subject: "",
    body: "",
  };
  useEffect(() => {
    dispatch(fetchEmailTemplate(kind));
  }, [kind, dispatch]);

  const update = useCallback(
    async (subject: string, body: string) => {
      try {
        await dispatch(
          updateEmailTemplate({ kind, template: { subject, body } })
        );
      } catch (e) {
        throw new Error(
          "Eメールテンプレートの更新に失敗しました: " + e.message
        );
      }
    },
    [kind, dispatch]
  );

  return [template, setKind, update];
}
