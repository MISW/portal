import { useState } from 'react';
import { NextPage } from 'next';
import RegisterForm, { SubmitResult } from 'components/layout/RegisterForm';
import { ConfigurableProfile } from 'user';
import { Alert } from '@mui/material';
import { useDispatch } from 'react-redux';
import { signup } from 'features/auth';
import { NoSSR } from 'components/utils/NoSSR';
import { withLoginOIDC } from 'middlewares/withLoginOIDC';
import { nonNullOrThrow } from 'utils';
import { useSelector } from 'react-redux';
import { selectCurrentOidcAccountInfo } from 'features/currentOidcAccount';

const Page: NextPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>();

  const accountInfo = nonNullOrThrow(useSelector(selectCurrentOidcAccountInfo));

  const onSubmit = async (user: ConfigurableProfile): Promise<SubmitResult> => {
    try {
      await dispatch(
        signup({
          ...user,
          university: {
            name: user.univName,
            department: user.department,
            subject: user.subject,
          },
        }),
      );
      setEmail(accountInfo.email);
      return {
        status: 'success' as const,
      };
    } catch (err) {
      //TODO: errorメッセージ表示。エラー起きた時の型変換してエラーメッセージ表示
      console.error(err);
      return {
        status: 'error' as const,
        message: 'エラーが発生しました',
      };
    }
  };

  return (
    <NoSSR>
      <RegisterForm
        formName="会員登録"
        formType="new"
        onSubmit={onSubmit}
        successMessage={<>{email && <Alert severity="info">{email} 宛に確認メールがが送信されました! ✈</Alert>}</>}
      />
    </NoSSR>
  );
};

export default withLoginOIDC(Page);
