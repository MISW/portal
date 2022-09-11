import { createElement } from 'react';
import { NextPage, NextComponentType, NextPageContext } from 'next';
import Router from 'next/router';
import { wrapper } from 'store';
import { fetchCurrentOidcAccountInfo, selectCurrentOidcAccountInfo } from 'features/currentOidcAccount';
import { Merge } from 'type-fest';
import { currentOidcAccountInfo } from 'features/currentOidcAccount/slice';
import { selectCurrentUser } from 'features/currentUser';
import { useDispatch } from 'react-redux';

type WithCurrentOidcAccount<T> = Merge<
  T,
  {
    readonly currentOidcAccount: currentOidcAccountInfo;
  }
>;

export type NextPageWithOidcAccountInfo<P = Record<string, never>, IP = P> = NextComponentType<WithCurrentOidcAccount<NextPageContext>, IP, WithCurrentOidcAccount<P>>;

/**
 * OIDCでログインしたユーザーを許可する. ポータルにまだアカウントを持っていないユーザーのみサーバーがAccountInfoを返して許可するようになっている。
 * `/signup`などに適用 
 * OIDCのAccountInfoが取れなかった場合は/に飛ばす
 */
export const withLoginOIDC = <P, IP>(page: NextPage<P, IP>) => {
  const wrapped: NextPage<P, IP | undefined> = (props) => createElement(page, props);
  wrapped.getInitialProps = wrapper.getInitialPageProps((store) => async (ctx) => {
    const currentOidcAccount = selectCurrentOidcAccountInfo(store.getState());
    if (currentOidcAccount == null){
      await store.dispatch(fetchCurrentOidcAccountInfo()); //fetch and store
      const newAccountInfo = selectCurrentOidcAccountInfo(store.getState());
      if(newAccountInfo==null){
        if (ctx.res) { 
          // server
          ctx.res.writeHead(302, {
            Location: '/',
          });
          ctx.res.end();
          return;
        } else { 
          // client
          Router.push('/');
          return;
        }    
      }

      return 
    }

    return await page.getInitialProps?.({
      ...ctx,
    });
  });
  return wrapped;
};
