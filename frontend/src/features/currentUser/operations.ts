import { createAppAsyncThunk, AppThunk } from "store/helpers";
import { userUpserted, userCleared } from "features/users/slice";
import { logouted, paymentStatusesFetched } from "./slice";
import { ConfigurableProfile } from "user";

export const fetchCurrentUser = createAppAsyncThunk(
  "currentUser/fetch",
  async (_, { dispatch, extra: { api } }) => {
    const user = await api.fetchCurrentProfile();
    dispatch(userUpserted(user));
    return user.id;
  }
);

export const updateCurrentUser = createAppAsyncThunk(
  "currentUser/update",
  async (updateInput: ConfigurableProfile, { dispatch, extra: { api } }) => {
    const user = await api.updateCurrentProfile({
      ...updateInput,
      university: {
        name: updateInput.univName,
        department: updateInput.department,
        subject: updateInput.subject,
      },
    });
    dispatch(userUpserted(user));
    return user.id;
  }
);

export const fetchCurrentPaymentStatuses = (): AppThunk => async (
  dispatch,
  _,
  { api }
) => {
  const paymentStatuses = await api.fetchCurrentPaymentStatuses();
  dispatch(paymentStatusesFetched(paymentStatuses));
};

export const logout = createAppAsyncThunk(
  "currentUser/logout",
  async (_, { dispatch, extra: { api } }) => {
    await api.logout();
    dispatch(userCleared());
    dispatch(logouted());
  }
);
