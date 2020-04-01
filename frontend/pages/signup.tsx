import React from "react";
import { NextPage } from "next";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";
import RegisterForm from "../src/components/layout/RegisterForm";

const Page: NextPage<{}> = () => {
  return (
    <DefaultLayout>
      <RegisterForm formName="会員登録"></RegisterForm>
    </DefaultLayout>
  );
};

export default Page;
