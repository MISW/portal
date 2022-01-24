import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { hydrated } from 'store/helpers';
import { fetchCurrentUser, updateCurrentUser } from './operations';
import { PaymentStatus } from 'models/user';

type UserId = number;

type CurrentUserState = {
  id: UserId | undefined;
  paymentStatuses: PaymentStatus[] | undefined;
};

const initialState: CurrentUserState = {
  id: undefined,
  paymentStatuses: undefined,
};

const updateUserId = (
  state: CurrentUserState,
  action: PayloadAction<UserId>,
) => {
  state.id = action.payload;
};

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    paymentStatusesFetched: (state, action: PayloadAction<PaymentStatus[]>) => {
      state.paymentStatuses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrated, (_, action) => action.payload.currentUser)
      .addCase(fetchCurrentUser.fulfilled, updateUserId)
      .addCase(updateCurrentUser.fulfilled, updateUserId);
  },
});

export const { paymentStatusesFetched } = currentUserSlice.actions;
export const currentUserReducer = currentUserSlice.reducer;
