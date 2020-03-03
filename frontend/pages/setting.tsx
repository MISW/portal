import React from 'react';
import { NextPage } from 'next';
import { DefaultLayout } from '../src/components/layout/DefaultLayout';
import RegisterForm from '../src/components/layout/RegistrationForm';

const Page: NextPage = () => (
  <DefaultLayout>
    <RegisterForm formName="会員情報設定"/>
  </DefaultLayout>
);

export default Page;
