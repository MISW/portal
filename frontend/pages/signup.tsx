import React, { useState } from "react";
import { NextPage } from "next";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";
import RegisterForm from "../src/components/layout/RegisterForm";
import { signUp } from "../src/network";
import { UserProfile } from "../src/user";
import { Typography, Paper } from "@material-ui/core";
import { useStyles } from "../src/components/layout/RegistrationFormStepper";

const Page: NextPage<{}> = () => {
  const [email, setEmail] = useState<string>();
  const onSubmit = (user: UserProfile) => {
    signUp(user)
      .then(() => setEmail(user.email))
      .catch((err) => console.error(err));
  };
  const classes = useStyles();

  return (
    <DefaultLayout>
      {email ? (
        <Paper className={classes.paper}>
          <Typography align="center">{email} 宛に確認メールがが送信されました! ✈</Typography>
        </Paper>
      ) : (
        <RegisterForm formName="会員登録" onSubmit={onSubmit}></RegisterForm>
      )}
    </DefaultLayout>
  );
};

export default Page;
