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
import { unwrapResult } from "@reduxjs/toolkit";
import { EmailKind } from "models/appconfig";

export type PeriodConfigState = () => [
  number | undefined,
  (period: number) => Promise<void>
];

export const usePaymentPeriodConfig: PeriodConfigState = () => {
  const dispatch = useDispatch();
  const paymentPeriod = useSelector(selectPaymentPeriod);
  useEffect(() => {
    const task = dispatch(fetchPaymentPeriod());
    return () => task.abort();
  }, [dispatch]);

  const update = useCallback(
    async (newPaymentPeriod: number) => {
      try {
        await dispatch(updatePaymentPeriod(newPaymentPeriod)).then(
          unwrapResult
        );
      } catch (e) {
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
    const task = dispatch(fetchCurrentPeriod());
    return () => task.abort();
  }, [dispatch]);

  const update = useCallback(
    async (newCurrentPeriod: number) => {
      try {
        await dispatch(updateCurrentPeriod(newCurrentPeriod)).then(
          unwrapResult
        );
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
    const task = dispatch(fetchEmailTemplate(kind));
    return () => task.abort();
  }, [kind, dispatch]);

  const update = useCallback(
    async (subject: string, body: string) => {
      try {
        await dispatch(
          updateEmailTemplate({ kind, template: { subject, body } })
        ).then(unwrapResult);
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
