import "next";
import { UserAllInfoJSON } from "./user";

declare module "next" {
  interface NextPageContext {
    readonly userInfo?: UserAllInfoJSON;
  }
}
