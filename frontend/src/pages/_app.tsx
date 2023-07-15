// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import 'tailwindcss/tailwind.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { DefaultLayout } from 'components/layout/DefaultLayout';
import { wrapper } from 'store';
import { fetchCurrentUser, selectCurrentUser } from 'features/currentUser';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createCache from '@emotion/cache';
import { useLogout } from 'features/auth';
import { useSystemColorScheme } from '../hooks/theme';
import lighttheme from '../components/theme/lighttheme';
import darktheme from '../components/theme/darktheme';
import favicon from 'assets/favicon.ico';

declare module '@mui/material/styles/ThemeProvider' {
  interface DefaultTheme extends Theme {}
}

const isBrowser = typeof document !== 'undefined';

function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>('meta[name="emotion-insertion-point"]');
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: 'mui-style', insertionPoint });
}

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const scheme = useSystemColorScheme();
  const { handleLogout } = useLogout();

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>みすポータル</title>
        <link rel="shortcut icon" href={favicon.src} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={scheme === 'dark' ? darktheme : lighttheme}>
        <CssBaseline />
        <DefaultLayout onLogout={handleLogout}>
          <Component {...pageProps} />
        </DefaultLayout>
      </ThemeProvider>
    </CacheProvider>
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
