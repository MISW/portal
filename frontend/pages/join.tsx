import React from 'react';
import RegisterForm from '../components/layout/RegistrationForm';
import { NextPage } from 'next';
import { DefaultLayout } from '../components/layout/DefaultLayout';

const Page: NextPage<{}> = _ => {
  return (
    <DefaultLayout>
      <RegisterForm formName="会員登録"></RegisterForm>
    </DefaultLayout>
  );
};

export default Page;