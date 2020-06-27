import React from "react";
import { NextPage, NextComponentType, NextPageContext } from "next";
import Router from "next/router";
import { UserAllInfoJSON } from "user";
import { RootState } from "store";

export type NextPageWithUserInfo<P = {}, IP = P> = NextComponentType<
  NextPageContext<RootState> & { readonly userInfo: UserAllInfoJSON },
  IP,
  P & { readonly userInfo: UserAllInfoJSON }
>;

/**
 * ログインしていることを強制する．ログインしてなかったら/loginに飛ばす
 */
export const withLogin = <P, IP>(page: NextPageWithUserInfo<P, IP>) => {
  const wrapped: NextPage<
    P & { readonly userInfo: UserAllInfoJSON },
    (IP & { readonly userInfo: UserAllInfoJSON }) | undefined
  > = (props) => React.createElement(page, props);
  wrapped.getInitialProps = async (ctx) => {
    const userInfo = ctx.userInfo;
    if (userInfo == null) {
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
    const initialProps = await page.getInitialProps?.({ ...ctx, userInfo });
    return {
      userInfo,
      ...initialProps,
    } as
      | ({
          userInfo: UserAllInfoJSON;
        } & IP)
      | undefined;
  };
  return wrapped;
};
