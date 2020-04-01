import React from "react";
import { NextPage } from "next";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";
import RegisterForm from "../src/components/layout/RegisterForm";
import { signUp } from "../src/network";
import { UserForSignUp } from "../src/user";

const Page: NextPage<{}> = () => {
  const onSubmit = (user: UserForSignUp) => {
    signUp(user)
      .then(() => console.log("signUp!"))
      .catch((err) => console.error(err));
  };

  return (
    <DefaultLayout>
      <RegisterForm formName="会員登録" onSubmit={onSubmit}></RegisterForm>
    </DefaultLayout>
  );
};

export default Page;
