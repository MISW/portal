import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Alert, Button } from '@mui/material';
import { NoSSR } from 'components/utils/NoSSR';
import { useLogoutFromOIDC } from 'features/auth';
import { useSelector } from 'react-redux';
import { fetchCurrentOidcAccountInfo, selectCurrentOidcAccountInfo } from 'features/currentOidcAccount';
import { useDispatch } from 'react-redux';

const Page: NextPage = () => {
  const router = useRouter();
  const { handleLogout } = useLogoutFromOIDC();

  const dispatch = useDispatch();
  const accountInfo = useSelector(selectCurrentOidcAccountInfo);
  if (accountInfo == null) dispatch(fetchCurrentOidcAccountInfo());

  return accountInfo != null ? (
    <NoSSR>
      <p>会員登録方法</p>
      <ol>
        <li>フォームを埋める</li>
        <li>確認メールをチェック</li>
        <li>指定の口座番号へ入会費1000円を振込</li>
        <li>振込が確認され次第, 会員登録完了! </li>
      </ol>
      <br />
      <ol>
        <p>現在のアカウント: {accountInfo.accountId}</p>
        <p>現在のアカウントのメールアドレス: {accountInfo.email}</p>
      </ol>
      <br />
      <Link href="/signup/form" passHref legacyBehavior>
        <Button color="primary" variant="contained">
          会員登録フォームへ
        </Button>
      </Link>
      <Button onClick={handleLogout}>(別アカウントでログインする)</Button>
    </NoSSR>
  ) : (
    <NoSSR>
      <Alert severity="info">
        <p>まず最初にログイン(またはサインアップ)してください。</p>
        <small>discordアカウントでログインする場合は、MISWのdiscordに使ってるアカウントでログインしてください.</small>
        <small>slackアカウントを用いたログインは廃止予定です.</small>
      </Alert>
      <Button
        onClick={() => {
          router.push('/login');
        }}
      >
        ログイン(またはサインアップ)
      </Button>
      <br />
    </NoSSR>
  );
};

/*
Page.getInitialProps=wrapper.getInitialAppProps((store) => async ({ Component, ctx }) => {
  const userInfo = selectCurrentOidcAccountInfo(store.getState());
  if (userInfo == null) await store.dispatch(fetchCurrentOidcAccountInfo());

  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps({
        ...ctx,
      })
    : {};

  return {
    pageProps,
  };
});
*/

export default Page;
