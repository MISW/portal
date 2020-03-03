import React from 'react';
import RegisterForm from '../src/components/layout/RegistrationForm';
import { NextPage } from 'next';
import { DefaultLayout } from '../src/components/layout/DefaultLayout';

const Page: NextPage<{}> = _ => {
  return (
    <DefaultLayout>
      <RegisterForm formName="会員登録"></RegisterForm>
    </DefaultLayout>
  );
};

export default Page;