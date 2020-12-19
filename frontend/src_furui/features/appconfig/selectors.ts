import { Selector } from "../src_furui/store/helpers";
import {
  Period,
  EmailKind,
  EmailTemplate,
} from "../src_furui/models/appconfig";

export const selectPaymentPeriod: Selector<Period | undefined> = (state) =>
  state.appconfig.paymentPeriod;

export const selectCurrentPeriod: Selector<Period | undefined> = (state) =>
  state.appconfig.currentPeriod;

export const selectEmailTemplateOf = (
  kind: EmailKind
): Selector<EmailTemplate | undefined> => (state) =>
  state.appconfig.emailTemplates[kind];
