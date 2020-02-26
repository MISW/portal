// https://qiita.com/popose/items/160db3435e1cea9d897f

import React, { ComponentType } from 'react'
import { NextPage, NextPageContext } from 'next'

export interface Auth {
  token?: string
}

export type AuthPage<IP = {}, P = {}> = ComponentType<P> & {
  getInitialProps?(context: NextPageContext & { auth: Auth }): IP | Promise<IP>;
};

// export function loadAuthFromCookie(ctx: NextPageContext): Auth {
//   //
// }

export const AuthContext = React.createContext<Auth>({})

export const useAuth = () =>  {
  const auth = React.useContext(AuthContext);
  return {
    auth,
    login: () => {}, // ログイン処理
    logout: () => {} // ログアウト処理
  }
}
