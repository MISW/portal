import React, { useState } from "react";
import { NextPage } from "next";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";
import RegisterForm from "../src/components/layout/RegisterForm";
import { signUp } from "../src/network";
import { UserProfile } from "../src/user";
import { Typography } from "@material-ui/core";

const Page: NextPage<{}> = () => {
  const [email, setEmail] = useState<string>();
  const onSubmit = (user: UserProfile) => {
    signUp(user)
      .then(() => setEmail(user.email))
      .catch((err) => console.error(err));
  };

  return (
    <DefaultLayout>
      {email ? (
        <Typography>{email} 宛に確認メールがが送信されました!</Typography>
      ) : (
        <RegisterForm formName="会員登録" onSubmit={onSubmit}></RegisterForm>
      )}
    </DefaultLayout>
  );
};

export default Page;
