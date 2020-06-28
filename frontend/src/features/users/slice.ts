import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { User } from "models/user";
import { hydrated } from "store/helpers";
import { nonNull } from "utils";

export const userAdapter = createEntityAdapter<User>({
  selectId: (u) => u.id,
  // 降順
  sortComparer: (a, b) => a.id - b.id,
});

const usersSlice = createSlice({
  name: "users",
  initialState: userAdapter.getInitialState(),
  reducers: {
    userUpserted: userAdapter.upsertOne,
    userCleared: userAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(hydrated, (state, { payload }) => {
      const users = Object.values(payload.users.entities).filter(nonNull);
      return userAdapter.upsertMany(state, users);
    });
  },
});

export const { userUpserted, userCleared } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
