import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Alert, AlertTitle } from '@mui/material';
import { useVerifyEmail } from 'features/auth';

const Page: NextPage = () => {
  const { status, error: httpError, verifyEmail } = useVerifyEmail();
  const [error, setError] = useState<'token_required'>();
  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token == null) {
      setError('token_required');
      return;
    }
    verifyEmail(token);
  }, [verifyEmail]);

  if (status == null || status == 'pending') {
    return <p>loading</p>;
  }

  if (error != null || httpError != null) {
    const message = error
      ? 'tokenがありません'
      : httpError instanceof Error
      ? `${httpError.name}: ${httpError.message}`
      : '不明なエラー';
    return (
      <Alert severity="error">
        <AlertTitle>エラーが発生しました: {message}</AlertTitle>
        info@misw.jp や Twitter @misw_info または
        Discordへ問題を報告してください....
      </Alert>
    );
  }

  return <Alert severity="success">メールアドレスが認証できました！</Alert>;
};

export default Page;
