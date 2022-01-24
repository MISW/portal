import { createAppAsyncThunk, AppThunk } from 'store/helpers';
import { userUpserted } from 'features/users/slice';
import { paymentStatusesFetched } from './slice';
import { selectCurrentUser } from './selectors';
import { UpdateUserProfileInput } from 'models/user';

export const fetchCurrentUser = createAppAsyncThunk(
    'currentUser/fetch',
    async (_, { dispatch, extra: { api } }) => {
        const user = await api.fetchCurrentProfile();
        dispatch(userUpserted(user));
        return user.id;
    },
);

export const updateCurrentUser = createAppAsyncThunk(
    'currentUser/update',
    async (
        updateInput: Partial<UpdateUserProfileInput>,
        { dispatch, getState, extra: { api } },
    ) => {
        const currentUser = selectCurrentUser(getState());
        if (currentUser == null) throw new Error('not logged in');
        api.updateCurrentProfile(currentUser);
        const user = await api.updateCurrentProfile({
            ...currentUser,
            ...updateInput,
        });
        dispatch(userUpserted(user));
        return user.id;
    },
);

export const fetchCurrentPaymentStatuses =
    (): AppThunk =>
    async (dispatch, _, { api }) => {
        const paymentStatuses = await api.fetchCurrentPaymentStatuses();
        dispatch(paymentStatusesFetched(paymentStatuses));
    };
