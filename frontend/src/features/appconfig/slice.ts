import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Period, EmailKind, EmailTemplate } from "models/appconfig";
import { hydrated } from "store/helpers";

type State = Readonly<{
  paymentPeriod?: Period;
  currentPeriod?: Period;
  emailTemplates: {
    readonly [K in EmailKind]?: Readonly<EmailTemplate>;
  };
}>;

const initialState: State = {
  emailTemplates: {},
};

const appconfigSlice = createSlice({
  name: "appconfig",
  initialState,
  reducers: {
    paymentPeriodUpdated: (state, action: PayloadAction<Period>) => {
      state.paymentPeriod = action.payload;
    },
    currentPeriodUpdated: (state, action: PayloadAction<Period>) => {
      state.currentPeriod = action.payload;
    },
    emailTemplateUpdated: (
      state,
      action: PayloadAction<{
        kind: EmailKind;
        template: Readonly<EmailTemplate>;
      }>
    ) => {
      const { kind, template } = action.payload;
      state.emailTemplates[kind] = template;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrated, (_, action) => action.payload.appconfig);
  },
});

export const appconfigReducer = appconfigSlice.reducer;
export const {
  paymentPeriodUpdated,
  currentPeriodUpdated,
  emailTemplateUpdated,
} = appconfigSlice.actions;
