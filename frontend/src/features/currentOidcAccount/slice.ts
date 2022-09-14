import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type currentOidcAccountInfo = {
  token: string | undefined;
  accountId: string | undefined;
  email: string | undefined;
};

const initialState: currentOidcAccountInfo = {
  token: undefined,
  accountId: undefined,
  email: undefined,
};

const currentOidcAccountInfoSlice = createSlice({
  name: 'currentOidcAccountInfo',
  initialState,
  reducers: {
    save: (state, action: PayloadAction<currentOidcAccountInfo>) => {
      state.token = action.payload.token;
      state.accountId = action.payload.accountId;
      state.email = action.payload.email;
    },
  },
});

export const currentOidcAccountReducer = currentOidcAccountInfoSlice.reducer;
export const { save } = currentOidcAccountInfoSlice.actions;
