import "next";
import { UserAllInfoJSON } from "./src/user";
import { RootState, AppActions } from "./src/store";
import { AnyAction } from "redux";

declare module "next/dist/next-server/lib/utils" {
  interface NextPageContext<S = RootState, A extends AnyAction = AppActions> {
    readonly userInfo?: UserAllInfoJSON;
  }
}
