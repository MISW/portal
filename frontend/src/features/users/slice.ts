import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { User } from 'models/user';
import { hydrated } from 'store/helpers';
import { nonNull } from 'utils';
import { fetchAllUsers } from './operations';

export const userAdapter = createEntityAdapter<User>({
  selectId: (u) => u.id,
  // 降順
  sortComparer: (a, b) => a.id - b.id,
});

const usersSlice = createSlice({
  name: 'users',
  initialState: userAdapter.getInitialState(),
  reducers: {
    userUpserted: userAdapter.upsertOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrated, (state, { payload }) => {
        const users = Object.values(payload.users.entities).filter(nonNull);
        return userAdapter.upsertMany(state, users);
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        return userAdapter.upsertMany(state, action.payload);
      });
  },
});

export const { userUpserted } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
