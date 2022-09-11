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
 * それ以外の場合、/loginへ飛ばす
 */
export const withLoginUser = <P, IP>(page: NextPage<P, IP>) => {
  const wrapped: NextPage<P, IP | undefined> = (props) => createElement(page, props);
  wrapped.getInitialProps = wrapper.getInitialPageProps((store) => async (ctx) => {
    const currentUser = selectCurrentUser(store.getState());
    if (currentUser == null) {
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
    }
    return await page.getInitialProps?.({
      ...ctx,
    });
  });
  return wrapped;
};
