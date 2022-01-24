import { Selector } from 'store/helpers';
import { selectUserById } from 'features/users';
import { User, PaymentStatus } from 'models/user';

export const selectCurrentUser: Selector<User | undefined> = (state) => {
    const currentUserId = state.currentUser.id;
    if (currentUserId == null) return;
    return selectUserById(state, currentUserId);
};

export const selectCurrentPaymentStatuses: Selector<
    readonly PaymentStatus[] | undefined
> = (state) => state.currentUser.paymentStatuses;
