import React from "../src_furui/react";
import {
  NextPage,
  NextComponentType,
  NextPageContext,
} from "../src_furui/next";
import Router from "../src_furui/next/router";
import { RootState } from "../src_furui/store";
import { selectCurrentUser } from "../src_furui/features/currentUser";
import { Merge } from "../src_furui/type-fest";
import { User } from "../src_furui/models/user";

type WithCurrentUser<T> = Merge<T, { readonly currentUser: User }>;

export type NextPageWithUserInfo<P = {}, IP = P> = NextComponentType<
  WithCurrentUser<NextPageContext<RootState>>,
  IP,
  WithCurrentUser<P>
>;

/**
 * ログインしていることを強制する．ログインしてなかったら/loginに飛ばす
 */
export const withLogin = <P, IP>(page: NextPage<P, IP>) => {
  const wrapped: NextPage<P, IP | undefined> = (props) =>
    React.createElement(page, props);
  wrapped.getInitialProps = async (ctx) => {
    const currentUser = selectCurrentUser(ctx.store.getState());
    if (currentUser == null) {
      if (ctx.res) {
        // server
        ctx.res.writeHead(302, { Location: "/login" });
        ctx.res.end();
        return;
      } else {
        // client
        Router.push("/login");
        return;
      }
    }
    return await page.getInitialProps?.({
      ...ctx,
    });
  };
  return wrapped;
};
