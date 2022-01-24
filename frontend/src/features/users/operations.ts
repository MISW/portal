import { createAppAsyncThunk, AppThunk } from 'store/helpers';
import { userUpserted } from './slice';

export const fetchAllUsers = createAppAsyncThunk(
  'users/fetchAll',
  async (_, { extra: { api } }) => {
    const users = await api.fetchAllUsers();
    return users;
  },
);

export const fetchUserById = createAppAsyncThunk(
  'users/fetchById',
  async ({ id }: { id: number }, { dispatch, extra: { api } }) => {
    const user = await api.fetchUserById(id);
    if (user != null) {
      dispatch(userUpserted(user));
    }
    return user;
  },
);

type AddPaymentStatusParams = Readonly<{
  targetUserId: number;
}>;

export const addPaymentStatus =
  ({ targetUserId }: AddPaymentStatusParams): AppThunk =>
  async (dispatch, _, { api }) => {
    try {
      await api.addPaymentStatus(targetUserId);
    } finally {
      await dispatch(fetchUserById({ id: targetUserId }));
    }
  };

type DeletePaymentStatusParams = AddPaymentStatusParams;

export const deletePaymentStatus =
  ({ targetUserId }: DeletePaymentStatusParams): AppThunk =>
  async (dispatch, _, { api }) => {
    try {
      await api.deletePaymentStatus(targetUserId);
    } finally {
      await dispatch(fetchUserById({ id: targetUserId }));
    }
  };
