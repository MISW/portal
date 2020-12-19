// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import React, { useEffect } from "../src_furui/react";
import { AppProps } from "../src_furui/next/app";
import { ThemeProvider } from "../src_furui/@material-ui/styles";
import { CssBaseline, createMuiTheme } from "../src_furui/@material-ui/core";
import { NextPageContext } from "../src_furui/next";
import { DefaultLayout } from "../components/layout/DefaultLayout";
import { wrapper, RootState } from "../src_furui/store";
import {
  fetchCurrentUser,
  selectCurrentUser,
} from "../src_furui/features/currentUser";
import { useLogout } from "../src_furui/features/auth";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  });

  const { handleLogout } = useLogout();

  return (
    <ThemeProvider theme={createMuiTheme({})}>
      <CssBaseline />
      <DefaultLayout onLogout={handleLogout}>
        <Component {...pageProps} />
      </DefaultLayout>
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
  const userInfo = selectCurrentUser(ctx.store.getState());
  if (userInfo == null) await ctx.store.dispatch(fetchCurrentUser());

  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps({ ...ctx })
    : {};

  const ret = { pageProps };
  return ret;
};

export default wrapper.withRedux(App);
