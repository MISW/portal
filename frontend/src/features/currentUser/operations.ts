import { createAppAsyncThunk } from "store/helpers";
import { userUpserted, userCleared } from "features/users/slice";
import { logouted } from "./slice";

export const fetchCurrentUser = createAppAsyncThunk(
  "currentUser/fetch",
  async (_, { dispatch, extra: { api } }) => {
    const user = await api.fetchCurrentProfile();
    dispatch(userUpserted(user));
    return user.id;
  }
);

export const logout = createAppAsyncThunk(
  "currentUser/logout",
  async (_, { dispatch, extra: { api } }) => {
    await api.logout();
    dispatch(userCleared());
    dispatch(logouted());
  }
);
