import React from 'react';
import { NextPage } from 'next';
import { Alert } from '@mui/material';
import RegisterForm, { SubmitResult } from 'components/layout/RegisterForm';
import { ConfigurableProfile } from 'user';
import { withLogin } from 'middlewares/withLogin';
import { selectCurrentUser, updateCurrentUser } from 'features/currentUser';
import { nonNullOrThrow } from 'utils';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { NoSSR } from 'components/utils/NoSSR';

const Page: NextPage = () => {
  const dispatch = useDispatch();
  const currentUser = nonNullOrThrow(useSelector(selectCurrentUser));
  const onSubmit = async (user: ConfigurableProfile): Promise<SubmitResult> => {
    try {
      await dispatch(
        updateCurrentUser({
          ...user,
          university: {
            name: user.univName,
            department: user.department,
            subject: user.subject,
          },
        }),
      ).then(unwrapResult);
      return { status: 'success' as const };
    } catch (e) {
      console.error(e);
      return { status: 'error', message: 'エラーが発生しました' };
    }
  };
  return (
    <NoSSR>
      <RegisterForm
        formName="会員情報設定"
        formType="setting"
        user={currentUser}
        onSubmit={onSubmit}
        successMessage={
          <Alert severity="success">プロフィールが変更されました!</Alert>
        }
      />
    </NoSSR>
  );
};

export default withLogin(Page);
