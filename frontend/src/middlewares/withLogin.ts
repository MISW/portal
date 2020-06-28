import React from "react";
import { NextPage, NextComponentType, NextPageContext } from "next";
import Router from "next/router";
import { UserAllInfoJSON } from "user";
import { RootState } from "store";
import { selectCurrentUser } from "features/currentUser";
import { Merge } from "type-fest";

type WithCurrentUser<T> = Merge<T, { readonly currentUser: UserAllInfoJSON }>;

export type NextPageWithUserInfo<P = {}, IP = P> = NextComponentType<
  WithCurrentUser<NextPageContext<RootState>>,
  IP,
  WithCurrentUser<P>
>;

/**
 * ログインしていることを強制する．ログインしてなかったら/loginに飛ばす
 */
export const withLogin = <P, IP>(page: NextPageWithUserInfo<P, IP>) => {
  const wrapped: NextPage<
    WithCurrentUser<P>,
    WithCurrentUser<IP> | undefined
  > = (props) => React.createElement(page, props);
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
    const initialProps = await page.getInitialProps?.({
      ...ctx,
      currentUser,
    });
    return {
      currentUser,
      ...initialProps,
    } as WithCurrentUser<IP>;
  };
  return wrapped;
};
