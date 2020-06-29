import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { hydrated } from "store/helpers";
import {
  fetchCurrentUser,
  updateCurrentUser,
  fetchCurrentPaymentStatuses,
} from "./operations";
import { PaymentStatus } from "models/user";

type UserId = number;

type CurrentUserState = {
  id: UserId | undefined;
  paymentStatuses: Readonly<PaymentStatus>[] | undefined;
};

const initialState: CurrentUserState = {
  id: undefined,
  paymentStatuses: undefined,
};

const updateUserId = (
  state: CurrentUserState,
  action: PayloadAction<UserId>
) => {
  state.id = action.payload;
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    logouted: (state) => {
      state.id = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrated, (_, action) => action.payload.currentUser)
      .addCase(fetchCurrentUser.fulfilled, updateUserId)
      .addCase(updateCurrentUser.fulfilled, updateUserId)
      .addCase(fetchCurrentPaymentStatuses.fulfilled, (state, action) => {
        state.paymentStatuses = [...action.payload];
      });
  },
});

export const { logouted } = currentUserSlice.actions;
export const currentUserReducer = currentUserSlice.reducer;
