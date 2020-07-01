import { Selector } from "store/helpers";
import { selectUserById } from "features/users";
import { User } from "models/user";

export const selectCurrentUser: Selector<User | undefined> = (state) => {
  const currentUserId = state.currentUser.id;
  if (currentUserId == null) return;
  return selectUserById(state, currentUserId);
};
