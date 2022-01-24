import { Selector } from 'store/helpers';
import { Period, EmailKind, EmailTemplate } from 'models/appconfig';

export const selectPaymentPeriod: Selector<Period | undefined> = (state) =>
  state.appconfig.paymentPeriod;

export const selectCurrentPeriod: Selector<Period | undefined> = (state) =>
  state.appconfig.currentPeriod;

export const selectEmailTemplateOf =
  (kind: EmailKind): Selector<EmailTemplate | undefined> =>
  (state) =>
    state.appconfig.emailTemplates[kind];
