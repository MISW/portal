// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import React, { useEffect, createContext, useState, useCallback } from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { checkLoggingIn, logout } from "../src/network";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";

export const loginContext = createContext(false);

const App = (props: AppProps) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    // TODO: ここのpathによる分岐をなんとかしたい.
    switch (router.pathname) {
      case "/signup":
        return;
      case "/signup/form":
        return;
      case "/login":
        return;
      case "/callback":
        return;
      case "/verify_email":
        return;
      default: {
        let unmounted = false;
        if (!isLogin) {
          (async () => {
            const isLoginResult = await checkLoggingIn();
            if (!isLoginResult && !unmounted) {
              await router.push("/login");
            } else {
              setIsLogin(true);
            }
          })().catch((err) => {
            throw err;
          });
        }
        return () => {
          unmounted = true;
        };
      }
    }
  }, [isLogin, router]);
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
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps({ ...ctx })
    : {};
  return { pageProps };
};

export default App;
