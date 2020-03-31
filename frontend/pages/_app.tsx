// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, createMuiTheme } from '@material-ui/core';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { checkLoggingIn } from '../src/network';

const App = (props: AppProps) => {
  const router = useRouter();
  useEffect( () => {
    switch (router.pathname) {
      case '/signup':
        return;
      case '/callback':
        return;
      case '/verify_email':
        return;
      default:
        let unmounted = false;
        (async () => {
          const isLogginIn = await checkLoggingIn();
          if (!isLogginIn && !unmounted) {
            await router.push('/login');
          } else {
            console.log('already logging in');
          }
        })().catch(err => { throw err; });
      return () => { unmounted = true; };
    }
  }, []);
  useEffect( () => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  });
  const { Component, pageProps } = props;
  return (
    <ThemeProvider theme={createMuiTheme({})}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

App.getInitialProps = async ({
  Component,
  ctx,
}: {
  Component: any
  ctx: NextPageContext
}) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps({...ctx})
    : {};
  return { pageProps };
};

export default App;