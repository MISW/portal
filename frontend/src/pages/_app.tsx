// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import 'tailwindcss/tailwind.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { DefaultLayout } from 'components/layout/DefaultLayout';
import { wrapper } from 'store';
import { fetchCurrentUser, selectCurrentUser } from 'features/currentUser';
import { useLogout } from 'features/auth';
import { useSystemColorScheme } from '../hooks/theme';
import lighttheme from '../components/theme/lighttheme';
import darktheme from '../components/theme/darktheme';

declare module '@mui/material/styles/ThemeProvider' {
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

  const scheme = useSystemColorScheme();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={scheme === 'dark' ? darktheme : lighttheme}>
        <Head>
          <title>みすポータル</title>
          <meta name="viewport" content="initial-scale=1.0,width=device-width" />
        </Head>
        <CssBaseline />
        <DefaultLayout onLogout={handleLogout}>
          <Component {...pageProps} />
        </DefaultLayout>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

App.getInitialProps = wrapper.getInitialAppProps((store) => async ({ Component, ctx }) => {
  const userInfo = selectCurrentUser(store.getState());
  if (userInfo == null) await store.dispatch(fetchCurrentUser());

  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps({
        ...ctx,
      })
    : {};

  return {
    pageProps,
  };
});

export default wrapper.withRedux(App);
