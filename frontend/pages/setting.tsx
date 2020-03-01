import React from 'react';
import { NextPage } from 'next';
import { DefaultLayout } from '../components/layout/DefaultLayout';
import RegisterForm from '../components/layout/RegistrationForm';

const Page: NextPage = () => (
  <DefaultLayout>
    <RegisterForm formName="会員情報設定"/>
  </DefaultLayout>
);

export default Page;
