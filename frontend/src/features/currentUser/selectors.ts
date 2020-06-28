import { Selector } from "store/helpers";
import { UserAllInfoJSON } from "user";
import { selectUserById } from "features/users";

export const selectCurrentUser: Selector<UserAllInfoJSON | undefined> = (
  state
) => {
  const currentUserId = state.currentUser.id;
  if (currentUserId == null) return;
  return selectUserById(state, currentUserId);
};
