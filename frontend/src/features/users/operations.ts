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
