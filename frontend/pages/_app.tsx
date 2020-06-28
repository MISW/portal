// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import React, { useEffect, createContext } from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";
import { NextPageContext } from "next";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";
import { UserAllInfoJSON } from "../src/user";
import { wrapper, RootState } from "store";
import {
  fetchCurrentUser,
  selectCurrentUser,
  useLogout,
} from "features/currentUser";

export const accountInfoContext = createContext<UserAllInfoJSON | undefined>(
  undefined
);

const App = (props: AppProps & { userInfo: UserAllInfoJSON | undefined }) => {
  const { Component, pageProps, userInfo } = props;
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  });

  const handleLogout = useLogout();

  return (
    <ThemeProvider theme={createMuiTheme({})}>
      <CssBaseline />
      <accountInfoContext.Provider value={userInfo}>
        <DefaultLayout onLogout={handleLogout}>
          <Component {...pageProps} />
        </DefaultLayout>
      </accountInfoContext.Provider>
    </ThemeProvider>
  );
};

App.getInitialProps = async ({
  Component,
  ctx,
}: {
  Component: any;
  ctx: NextPageContext<RootState, any>;
}) => {
  // getInitialPropsはサーバー側かブラウザ側で実行される. サーバー側で実行する時のみ ctx.res, ctx.reqが存在する. これ大事

  let userInfo = selectCurrentUser(ctx.store.getState());
  if (userInfo == null) await ctx.store.dispatch(fetchCurrentUser());
  userInfo = selectCurrentUser(ctx.store.getState());

  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps({ ...ctx, userInfo })
    : {};

  const ret = { pageProps, userInfo };
  return ret;
};

export default wrapper.withRedux(App);
