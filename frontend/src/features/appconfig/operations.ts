import { AppThunk } from "store/helpers";
import {
  paymentPeriodUpdated,
  currentPeriodUpdated,
  emailTemplateUpdated,
} from "./slice";
import { EmailKind, Period, EmailTemplate } from "models/appconfig";

export const fetchPaymentPeriod =
  (): AppThunk =>
  async (dispatch, _, { api }) => {
    const period = await api.fetchPaymentPeriodConfig();
    dispatch(paymentPeriodUpdated(period));
  };

export const fetchCurrentPeriod =
  (): AppThunk =>
  async (dispatch, _, { api }) => {
    const period = await api.fetchCurrentPeriodConfig();
    dispatch(currentPeriodUpdated(period));
  };

export const fetchEmailTemplate =
  (kind: EmailKind): AppThunk =>
  async (dispatch, _, { api }) => {
    const template = await api.fetchEmailTemplateConfig(kind);
    dispatch(emailTemplateUpdated({ kind, template }));
  };

export const updatePaymentPeriod =
  (paymentPeriod: Period): AppThunk =>
  async (dispatch, _, { api }) => {
    await api.updateAppConfig({
      kind: "payment_period",
      payload: { paymentPeriod },
    });
    dispatch(fetchPaymentPeriod());
  };

export const updateCurrentPeriod =
  (currentPeriod: Period): AppThunk =>
  async (dispatch, _, { api }) => {
    await api.updateAppConfig({
      kind: "current_period",
      payload: { currentPeriod },
    });
    dispatch(fetchCurrentPeriod());
  };

export const updateEmailTemplate =
  ({
    kind,
    template,
  }: {
    kind: EmailKind;
    template: EmailTemplate;
  }): AppThunk =>
  async (dispatch, _, { api }) => {
    await api.updateAppConfig({
      kind: "email_template",
      payload: {
        emailKind: kind,
        subject: template.subject,
        body: template.body,
      },
    });
    dispatch(fetchEmailTemplate(kind));
  };
