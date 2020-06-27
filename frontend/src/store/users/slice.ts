import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { UserWithPaymentJSON } from "user";
import { hydrated } from "../helpers";

type User = UserWithPaymentJSON;

export const userAdapter = createEntityAdapter<User>({
  selectId: (u) => u.id,
  // 降順
  sortComparer: (a, b) => a.id - b.id,
});

const usersSlice = createSlice({
  name: "users",
  initialState: userAdapter.getInitialState(),
  reducers: {
    userAdded: userAdapter.addOne,
    userCleared: userAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(hydrated, (_, { payload }) => payload.users);
  },
});

export const { userAdded, userCleared } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
