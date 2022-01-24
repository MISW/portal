// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import 'tailwindcss/tailwind.css';
import 'focus-visible';
import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material/styles';
import { CssBaseline, createTheme, adaptV4Theme } from '@mui/material';
import { DefaultLayout } from 'components/layout/DefaultLayout';
import { wrapper } from 'store';
import { fetchCurrentUser, selectCurrentUser } from 'features/currentUser';
import { useLogout } from 'features/auth';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  });

  const { handleLogout } = useLogout();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme(adaptV4Theme({}))}>
        <Head>
          <title>MISW Portal</title>
          <meta
            name="viewport"
            content="initial-scale=1.0,width=device-width"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <CssBaseline />
        <DefaultLayout onLogout={handleLogout}>
          <Component {...pageProps} />
        </DefaultLayout>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

App.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ Component, ctx }) => {
      const userInfo = selectCurrentUser(store.getState());
      if (userInfo == null) await store.dispatch(fetchCurrentUser());

      const pageProps = Component.getInitialProps
        ? await Component.getInitialProps({ ...ctx })
        : {};

      const ret = { pageProps };
      return ret;
    },
);

export default wrapper.withRedux(App);
