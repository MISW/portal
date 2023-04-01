import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Alert, Button, List, ListItem, ListItemText } from '@mui/material';
import { NoSSR } from 'components/utils/NoSSR';
import { useLogoutFromOIDC } from 'features/auth';
import { useSelector } from 'react-redux';
import { fetchCurrentOidcAccountInfo, selectCurrentOidcAccountInfo } from 'features/currentOidcAccount';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store/store';

const Page: NextPage = () => {
  const router = useRouter();
  const { handleLogout } = useLogoutFromOIDC();

  const dispatch = useDispatch<AppDispatch>();
  const accountInfo = useSelector(selectCurrentOidcAccountInfo);
  if (accountInfo == null) dispatch(fetchCurrentOidcAccountInfo());

  return accountInfo != null ? (
    <NoSSR>
      <p>会員登録方法</p>
      <List dense>
        <ListItem>
          <ListItemText primary="フォームを埋める" />
        </ListItem>
        <ListItem>
          <ListItemText primary="確認メールをチェック" />
        </ListItem>
        <ListItem>
          <ListItemText primary="指定の口座番号へ入会費を振込（1年生1500円、2年生以上3000円）" />
        </ListItem>
        <ListItem>
          <ListItemText primary="振込が確認され次第, 会員登録完了!" />
        </ListItem>
      </List>
      <br />
      <ol>
        <p>現在のアカウント: {accountInfo.accountId}</p>
        <p>現在のアカウントのメールアドレス: {accountInfo.email}</p>
      </ol>
      <Button onClick={handleLogout}>(別アカウントでログインする)</Button>
      <br />
      <br />
      <Alert severity="error">
        <p>
          会員登録フォームへ進む前に、
          <a
            href="/policy"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'underline',
            }}
          >
            <span className="inline-block">
              <strong>プライバシーポリシー</strong>
            </span>
          </a>
          を必ずお読みください。
        </p>
        <p>会員登録フォームへ進むと、あなたの個人情報をMISWが取り扱うことに同意したものとみなします。</p>
      </Alert>
      <Link href="/signup/form" passHref legacyBehavior>
        <Button color="warning" variant="contained">
          プライバシーポリシーに同意して会員登録フォームへ
        </Button>
      </Link>
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
