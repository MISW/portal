import React from "react";
import { NextPage, NextComponentType, NextPageContext } from "next";
import Router from "next/router";
import { UserAllInfoJSON } from "../user";

export type NextPageWithUserInfo<P = {}, IP = P> = NextComponentType<
  NextPageContext & { readonly userInfo: UserAllInfoJSON },
  IP,
  P & { readonly userInfo: UserAllInfoJSON }
>;

/// ログインしていることを強制する．ログインしてなかったら/loginに飛ばす
export const withLogin = <P, IP>(page: NextPageWithUserInfo<P, IP>) => {
  const wrapped: NextPage<
    P & { readonly userInfo: UserAllInfoJSON },
    IP | undefined
  > = (props) => React.createElement(page, props);
  wrapped.getInitialProps = async (ctx) => {
    const userInfo = ctx.userInfo;
    if (userInfo == null) {
      if (ctx.req) {
        // server
        ctx.res?.writeHead(302, { Location: "/login" });
        ctx.res?.end();
        return;
      } else {
        // client
        Router.push("/login");
        return;
      }
    }
    return await page.getInitialProps?.({ ...ctx, userInfo });
  };
  return wrapped;
};
