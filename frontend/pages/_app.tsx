// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import React, { useEffect, createContext, useState, useCallback } from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";
import { NextPageContext } from "next";
import Router, { useRouter } from "next/router";
import { logout } from "../src/network";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";
import fetch from "isomorphic-unfetch";
import { UserAllInfoJSON } from "../src/user";

export const accountInfoContext = createContext<UserAllInfoJSON | undefined>(
  undefined
);

const App = (props: AppProps & { userInfo: UserAllInfoJSON | undefined }) => {
  const { Component, pageProps, userInfo } = props;
  const router = useRouter();
  const isLogin = Boolean(userInfo);
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  });

  const handleLogout = useCallback(async () => {
    await logout();
    router.reload();
  }, [router]);

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
  ctx: NextPageContext;
}) => {
  // getInitialPropsはサーバー側かブラウザ側で実行される. サーバー側で実行する時のみ ctx.res, ctx.reqが存在する. これ大事
  const baseHeaders = {
    Accept: "application/json, */*",
  };
  const headers = ctx.req
    ? Object.assign({ cookie: ctx.req.headers.cookie }, baseHeaders)
    : baseHeaders;

  const backendHost = ctx.req
    ? process.env.BACKEND_HOST
    : `${location.protocol}//${location.host}`;
  if (!backendHost) {
    const msg = "Please set environment: BACKEND_HOST (ex. http://backend)";
    console.error(msg);
    throw new Error(msg);
  }
  const res = await fetch(`${backendHost}/api/private/profile`, {
    headers,
    credentials: "include",
    method: "GET",
  });

  const isLogin = Math.floor(res.status / 100) === 2;

  const userInfo = isLogin
    ? ((await res.json()) as UserAllInfoJSON)
    : undefined;

  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps({ ...ctx, userInfo })
    : {};

  const ret = { pageProps, userInfo };

  const publicRoutes = [
    "/signup",
    "/signup/form",
    "/login",
    "/callback",
    "/verify_email",
  ];
  // 上記パス以外にアクセスした時, ログインしていなかったらリダイレクト

  if (publicRoutes.includes(ctx.pathname)) {
    return ret;
  }

  if (!isLogin) {
    if (ctx.res) {
      // サーバー側
      ctx.res.writeHead(302, { Location: "/login" });
      ctx.res.end();
    } else {
      // ブラウザ側
      Router.push("/login");
    }
  }
  return ret;
};

export default App;
