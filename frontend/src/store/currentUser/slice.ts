import { createSlice } from "@reduxjs/toolkit";
import { hydrated } from "../helpers";
import { fetchCurrentUser } from "./operations";

type CurrentUserState = {
  id: number | undefined;
};

const initialState: CurrentUserState = {
  id: undefined,
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
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.id = action.payload;
      });
  },
});

export const { logouted } = currentUserSlice.actions;
export const currentUserReducer = currentUserSlice.reducer;
