import { createElement } from 'react';
import { NextPage, NextComponentType, NextPageContext } from 'next';
import Router from 'next/router';
import { wrapper } from 'store';
import { fetchCurrentOidcAccountInfo, selectCurrentOidcAccountInfo } from 'features/currentOidcAccount';
import { Merge } from 'type-fest';
import { currentOidcAccountInfo } from 'features/currentOidcAccount/slice';
import { CombinedState, EntityState } from '@reduxjs/toolkit';
import { PaymentStatus, User } from 'models/user';

type WithCurrentOidcAccount<T> = Merge<
  T,
  {
    readonly currentOidcAccount: currentOidcAccountInfo;
  }
>;

export type NextPageWithOidcAccountInfo<P = Record<string, never>, IP = P> = NextComponentType<
  WithCurrentOidcAccount<NextPageContext>,
  IP,
  WithCurrentOidcAccount<P>
>;

/**
 * OIDCでログインしたユーザーを許可する. ポータルにまだアカウントを持っていないユーザーのみサーバーがAccountInfoを返して許可するようになっている。
 * `/signup`などに適用
 * OIDCのAccountInfoが取れなかった場合は/に飛ばす
 *
 * middlewareの実装にするのはいいとして、強制リダイレクトよりもエラー表示の方がユーザーに優しい気がする(?)
 */
export const withLoginOIDC = <P extends object, IP>(page: NextPage<P, IP>) => {
  const wrapped: NextPage<P, IP | undefined> = (props) => createElement(page, props);
  wrapped.getInitialProps = wrapper.getInitialPageProps(
    (store: {
        getState: () => CombinedState<{
          users: EntityState<User>;
          currentOidcAccountInfo: currentOidcAccountInfo;
          currentUser: {
            id: number | undefined;
            paymentStatuses: PaymentStatus[] | undefined;
          };
          appconfig: Readonly<{
            paymentPeriod?: number | undefined;
            currentPeriod?: number | undefined;
            emailTemplates: {
              readonly email_verification?:
                | Readonly<
                    Readonly<{
                      subject: string;
                      body: string;
                    }>
                  >
                | undefined;
              readonly after_registration?:
                | Readonly<
                    Readonly<{
                      subject: string;
                      body: string;
                    }>
                  >
                | undefined;
              readonly payment_receipt?:
                | Readonly<
                    Readonly<{
                      subject: string;
                      body: string;
                    }>
                  >
                | undefined;
              readonly payment_reminder?:
                | Readonly<
                    Readonly<{
                      subject: string;
                      body: string;
                    }>
                  >
                | undefined;
            };
          }>;
        }>;
        dispatch: any;
      }) =>
      async (ctx: NextPageContext) => {
        const currentOidcAccount = selectCurrentOidcAccountInfo(store.getState());
        if (currentOidcAccount == null) {
          await store.dispatch(fetchCurrentOidcAccountInfo()); //fetch and store
          const newAccountInfo = selectCurrentOidcAccountInfo(store.getState());
          if (newAccountInfo == null) {
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

          return;
        }

        return await page.getInitialProps?.({
          ...ctx,
        });
      },
  );
  return wrapped;
};
