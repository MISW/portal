import { userAdapter } from "./slice";
import { RootState } from "store";

export const { selectById: selectUserById } = userAdapter.getSelectors<
  RootState
>((state) => state.users);
