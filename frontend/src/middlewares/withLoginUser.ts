import { createElement } from 'react';
import { NextPage, NextComponentType, NextPageContext } from 'next';
import Router from 'next/router';
import { wrapper } from 'store';
import { selectCurrentUser } from 'features/currentUser';
import { Merge } from 'type-fest';
import { PaymentStatus, User } from 'models/user';
import { CombinedState, EntityState } from '@reduxjs/toolkit';
import { currentOidcAccountInfo } from 'features/currentOidcAccount/slice';

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
export const withLoginUser = <P extends object, IP>(page: NextPage<P, IP>) => {
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
      }) =>
      async (ctx: NextPageContext) => {
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
      },
  );
  return wrapped;
};
