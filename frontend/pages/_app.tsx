// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import React from 'react'
import NextApp from 'next/app'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@material-ui/styles'
import { CssBaseline, createMuiTheme } from '@material-ui/core'
import { Auth, AuthContext } from '../auth/auth'
import { NextPageContext } from 'next'

class App extends NextApp<AppProps & {auth: Auth}> {
  static async getInitialProps({
    Component,
    ctx
  }: {
    Component: any
    ctx: NextPageContext
  }) {
    const auth = {token: 'hoge'} //loadAuthFromCookie(ctx)
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps({...ctx, auth})
      : {}
    return { pageProps, auth }
  }
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  render() {
    const { Component, pageProps, auth } = this.props;
    return (
      <ThemeProvider theme={createMuiTheme({})}>
        <CssBaseline />
        <AuthContext.Provider value={auth}>
          <Component {...pageProps} />
        </AuthContext.Provider>
      </ThemeProvider>
    );
  }
}

export default App