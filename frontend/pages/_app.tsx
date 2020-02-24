// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js 参照

import React from 'react'
import NextApp from 'next/app'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@material-ui/styles'
import { CssBaseline, createMuiTheme } from '@material-ui/core'

class App extends NextApp<AppProps> {
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    console.log(jssStyles)
    console.log(jssStyles?.parentNode)
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={createMuiTheme({})}>
        <CssBaseline />

        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}

export default App