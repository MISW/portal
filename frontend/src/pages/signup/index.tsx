import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@mui/material';
import { NoSSR } from 'components/utils/NoSSR';
import { useLogoutFromOIDC } from 'features/auth';
import { nonNullOrThrow } from 'utils';
import { useSelector } from 'react-redux';
import { selectCurrentOidcAccountInfo } from 'features/currentOidcAccount';
import { withLoginOIDC } from 'middlewares/withLoginOIDC';

const Page: NextPage = () => {
  const {handleLogout} = useLogoutFromOIDC();
  const accountInfo = nonNullOrThrow(useSelector(selectCurrentOidcAccountInfo))

  return (
    <NoSSR>
      <p>会員登録方法</p>
      <ol>
        <li>フォームを埋める</li>
        <li>確認メールをチェック</li>
        <li>指定の口座番号へ入会費1000円を振込</li>
        <li>振込が確認され次第, 会員登録完了! </li>
      </ol>
      <br/>
      <ol>
        <p>現在のアカウント: {accountInfo.accountId}</p>
        <p>現在のアカウントのメールアドレス: {accountInfo.email}</p>
      </ol>
      <br/>
      <Link href="/signup/form" passHref>
        <Button color="primary" variant="contained">
          会員登録フォームへ
        </Button>
      </Link>
      <Button onClick={handleLogout} >
        (別アカウントでログインする)
      </Button>
    </NoSSR>
  );
};

export default withLoginOIDC(Page);
