import React from 'react'
import App from 'next/app'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@material-ui/styles'
import { CssBaseline, createMuiTheme } from '@material-ui/core'

function MyApp({Component, pageProps}: AppProps) {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    alert('hoge')
    return (
      <ThemeProvider theme={createMuiTheme({})}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    )
}

export default MyApp