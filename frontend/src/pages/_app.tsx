// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import "tailwindcss/tailwind.css";
import "focus-visible";
import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";
import { NextPageContext } from "next";
import { DefaultLayout } from "components/layout/DefaultLayout";
import { wrapper, RootState } from "store";
import { fetchCurrentUser, selectCurrentUser } from "features/currentUser";
import { useLogout } from "features/auth";

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
