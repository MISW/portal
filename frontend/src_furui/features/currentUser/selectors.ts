import { Selector } from "../src_furui/store/helpers";
import { selectUserById } from "../src_furui/features/users";
import { User, PaymentStatus } from "../src_furui/models/user";

export const selectCurrentUser: Selector<User | undefined> = (state) => {
  const currentUserId = state.currentUser.id;
  if (currentUserId == null) return;
  return selectUserById(state, currentUserId);
};

export const selectCurrentPaymentStatuses: Selector<
  readonly PaymentStatus[] | undefined
> = (state) => state.currentUser.paymentStatuses;
