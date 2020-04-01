import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";
import RegisterForm from "../src/components/layout/RegisterForm";
import { UserForSignUp } from "../src/user";
import { getProfile, updateProfile } from "../src/network";

const Page: NextPage = () => {
  const [user, setUser] = useState<UserForSignUp>();
  useEffect(() => {
    getProfile().then((u) => setUser(u));
  }, []);
  const onSubmit = (user: UserForSignUp) => {
    updateProfile(user)
      .then((u) => console.log(u))
      .catch((err) => console.error(err));
  };
  return (
    <DefaultLayout>
      {user ? <RegisterForm formName="会員情報設定" user={user} onSubmit={onSubmit} /> : "Loading..."}
    </DefaultLayout>
  );
};

export default Page;
