import { createElement } from 'react';
import { NextPage, NextComponentType, NextPageContext } from 'next';
import Router from 'next/router';
import { wrapper } from 'store';
import { selectCurrentUser } from 'features/currentUser';
import { Merge } from 'type-fest';
import { User } from 'models/user';
import { selectCurrentOidcAccountInfo } from 'features/currentOidcAccount';

type WithCurrentUser<T> = Merge<
  T,
  {
    readonly currentUser: User;
  }
>;

export type NextPageWithUserInfo<P = Record<string, never>, IP = P> = NextComponentType<WithCurrentUser<NextPageContext>, IP, WithCurrentUser<P>>;

/**
 * ログインしていることを強制する．ログインしてなかったら/loginに飛ばす
 * DBに情報をもつユーザ(Signup済み)であればcurrentUserで何もしない
 * DBに情報をもたないユーザ(未Signup)であればcurrentOidcAccountで、/signupへ飛ばす. (注意: /loginを叩かないと、ユーザ情報の更新はできない.)
 * どれでもなければ、未ログインとして/loginへ飛ばす.
 */
export const withLogin = <P, IP>(page: NextPage<P, IP>) => {
  const wrapped: NextPage<P, IP | undefined> = (props) => createElement(page, props);
  wrapped.getInitialProps = wrapper.getInitialPageProps((store) => async (ctx) => {
    const currentUser = selectCurrentUser(store.getState());
    const currentOidcAccount = selectCurrentOidcAccountInfo(store.getState());
    if (currentUser == null) {
      if (currentOidcAccount == null) {
        if (ctx.res) {
          // server
          ctx.res.writeHead(302, {
            Location: '/login',
          });
          ctx.res.end();
          return;
        } else {
          // client
          Router.push('/login');
          return;
        }
      } else {
        if (ctx.res) {
          // server
          ctx.res.writeHead(302, {
            Location: '/signup',
          });
          ctx.res.end();
          return;
        } else {
          // client
          Router.push('/signup');
          return;
        }
      }
    }
    return await page.getInitialProps?.({
      ...ctx,
    });
  });
  return wrapped;
};
