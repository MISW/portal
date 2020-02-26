import React from "react";
import { DefaultLayout } from "../components/layout/DefaultLayout";
import RegisterForm from "../components/layout/RegistrationForm"
import NextLink from "next/link";
import Button from "@material-ui/core/Button";
import { AuthPage, useAuth, Auth } from "../auth/auth";

const Page: AuthPage<void, void> = () => {
  const { auth } = useAuth();
  return (
    <>
      <h1>token = {auth.token}</h1>
      <DefaultLayout>
        <h1>ここにすばらしいポータルサイトができます</h1>
        <NextLink href="/setting">
          <Button className="button" variant="contained" color="primary">
            会員情報設定
          </Button>
        </NextLink>
        <RegisterForm />
      </DefaultLayout>
    </>
  )
};


Page.getInitialProps = async ({ auth }: {auth: Auth}) => {
  console.log(auth);
}

export default Page;
