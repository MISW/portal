import { RootState } from "../src_furui/store";
import { userAdapter } from "./slice";

const adapterSelectors = userAdapter.getSelectors(
  (state: RootState) => state.users
);

export const {
  selectById: selectUserById,
  selectAll: selectAllUsers,
} = adapterSelectors;
