import { Selector } from "store/helpers";
import { currentOidcAccountInfo } from "./slice";

export const selectCurrentOidcAccountInfo: Selector<currentOidcAccountInfo | undefined> = (state) => {
    const currentOidcAccountInfo = state.currentOidcAccountInfo;
    if (currentOidcAccountInfo.token == null || currentOidcAccountInfo.accountId == null || currentOidcAccountInfo.email == null) return;
    return currentOidcAccountInfo;
  };