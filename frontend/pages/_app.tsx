// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import React from 'react'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@material-ui/styles'
import { CssBaseline, createMuiTheme } from '@material-ui/core'
import { Auth, AuthContext } from '../auth/auth'
import { NextPageContext } from 'next'
import fetch from 'isomorphic-unfetch'


const App = (props: AppProps & {auth: Auth}) => {
  React.useEffect( () => {
    (async () => {
      const json = await fetch('http://localhost:10080/api/public/login', {
        headers: {
          'Accept': 'applicaton/json, */*',
          'Content-type': 'application/json'
        },
        method: 'POST'
      }).then(res => res.json())
      .catch( err => console.error(err));
      console.log(json.redirect_url)

    })()
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  })
  const { Component, pageProps, auth } = props;
  return (
    <ThemeProvider theme={createMuiTheme({})}>
      <CssBaseline />
      <AuthContext.Provider value={auth}>
        <Component {...pageProps} />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

App.getInitialProps = async ({
  Component,
  ctx,
}: {
  Component: any
  ctx: NextPageContext
}) => {
  const auth = {token: 'hoge'} //loadAuthFromCookie(ctx)
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps({...ctx, auth})
    : {}
  return { pageProps, auth }
}

export default App