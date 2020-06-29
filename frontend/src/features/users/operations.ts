import { createAppAsyncThunk } from "store/helpers";
import { userUpserted } from "./slice";

export const fetchAllUsers = createAppAsyncThunk(
  "users/fetchAll",
  async (_, { extra: { api } }) => {
    const users = await api.fetchAllUsers();
    return users;
  }
);

export const fetchUserById = createAppAsyncThunk(
  "users/fetchById",
  async ({ id }: { id: number }, { dispatch, extra: { api } }) => {
    const user = await api.fetchUserById(id);
    if (user != null) {
      dispatch(userUpserted(user));
    }
    return user;
  }
);

type AddPaymentStatusParams = Readonly<{
  targetUserId: number;
}>;

export const addPaymentStatus = createAppAsyncThunk(
  "users/addPaymentStatus",
  async (
    { targetUserId }: AddPaymentStatusParams,
    { dispatch, extra: { api } }
  ) => {
    await api.addPaymentStatus(targetUserId);
    await dispatch(fetchUserById({ id: targetUserId }));
  }
);

type DeletePaymentStatusParams = AddPaymentStatusParams;

export const deletePaymentStatus = createAppAsyncThunk(
  "users/deletePaymentStatus",
  async (
    { targetUserId }: DeletePaymentStatusParams,
    { dispatch, extra: { api } }
  ) => {
    await api.deletePaymentStatus(targetUserId);
    await dispatch(fetchUserById({ id: targetUserId }));
  }
);
