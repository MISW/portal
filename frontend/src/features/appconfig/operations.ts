import { createAppAsyncThunk } from "store/helpers";
import {
  paymentPeriodUpdated,
  currentPeriodUpdated,
  emailTemplateUpdated,
} from "./slice";
import { EmailKind, Period, EmailTemplate } from "models/appconfig";

export const fetchPaymentPeriod = createAppAsyncThunk(
  "appconfig/paymentPeriod/fetch",
  async (_, { dispatch, extra: { api } }) => {
    const period = await api.fetchPaymentPeriodConfig();
    dispatch(paymentPeriodUpdated(period));
  }
);

export const fetchCurrentPeriod = createAppAsyncThunk(
  "appconfig/currentPeriod/fetch",
  async (_, { dispatch, extra: { api } }) => {
    const period = await api.fetchCurrentPeriodConfig();
    dispatch(currentPeriodUpdated(period));
  }
);

export const fetchEmailTemplate = createAppAsyncThunk(
  "appconfig/emailTemplates/fetchByKind",
  async (kind: EmailKind, { dispatch, extra: { api } }) => {
    const template = await api.fetchEmailTemplateConfig(kind);
    dispatch(emailTemplateUpdated({ kind, template }));
  }
);

export const updatePaymentPeriod = createAppAsyncThunk(
  "appconfig/paymentPeriod/update",
  async (paymentPeriod: Period, { dispatch, extra: { api } }) => {
    await api.updateAppConfig({
      kind: "payment_period",
      payload: { paymentPeriod },
    });
    dispatch(fetchPaymentPeriod());
  }
);

export const updateCurrentPeriod = createAppAsyncThunk(
  "appconfig/currentPeriod/update",
  async (currentPeriod: Period, { dispatch, extra: { api } }) => {
    await api.updateAppConfig({
      kind: "current_period",
      payload: { currentPeriod },
    });
    dispatch(fetchCurrentPeriod());
  }
);

export const updateEmailTemplate = createAppAsyncThunk(
  "appconfig/emailTemplate/update",
  async (
    { kind, template }: { kind: EmailKind; template: EmailTemplate },
    { dispatch, extra: { api } }
  ) => {
    await api.updateAppConfig({
      kind: "email_template",
      payload: {
        emailKind: kind,
        subject: template.subject,
        body: template.body,
      },
    });
    dispatch(fetchEmailTemplate(kind));
  }
);
