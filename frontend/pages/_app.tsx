// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import React, { useEffect, createContext, useState, useCallback } from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";
import { NextPageContext } from "next";
import Router, { useRouter } from "next/router";
import { checkLoggingIn, logout } from "../src/network";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";
import fetch from "isomorphic-unfetch";

export const loginContext = createContext(false);

const App = (props: AppProps & { isLogin: boolean }) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(props.isLogin);
  useEffect(() => {
    setIsLogin(props.isLogin);
  }, [props.isLogin]);
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  });

  const handleLogout = useCallback(async () => {
    await logout();
    setIsLogin(false);
    router.reload();
  }, [router]);

  const { Component, pageProps } = props;
  return (
    <ThemeProvider theme={createMuiTheme({})}>
      <CssBaseline />
      <loginContext.Provider value={isLogin}>
        <DefaultLayout onLogout={handleLogout}>
          <Component {...pageProps} />
        </DefaultLayout>
      </loginContext.Provider>
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

  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps({ ...ctx })
    : {};

  const publicRoutes = [
    "/signup",
    "/signup/form",
    "/login",
    "/callback",
    "/verify_email",
  ];
  // 上記パス以外にアクセスした時, ログインしていなかったらリダイレクト

  if (Math.floor(res.status / 100) !== 2) {
    if (publicRoutes.includes(ctx.pathname)) {
      return { pageProps };
    }
    if (ctx.res) {
      // サーバー側
      ctx.res.writeHead(302, { Location: "/login" });
      ctx.res.end();
    } else {
      // ブラウザ側
      Router.push("/login");
    }
    return { pageProps, isLogin: false };
  }

  return { pageProps, isLogin: true };
};

export default App;
