import React, { useState } from "react";
import { NextPage } from "next";
import RegisterForm, {
  SubmitResult,
} from "../../src/components/layout/RegisterForm";
import { signUp } from "../../src/network";
import { UserProfile } from "../../src/user";
import { Alert } from "@material-ui/lab";

const Page: NextPage<{}> = () => {
  const [email, setEmail] = useState<string>();
  const onSubmit = (user: UserProfile): Promise<SubmitResult> => {
    return signUp(user)
      .then(() => {
        setEmail(user.email);
        return { status: "success" as const };
      })
      .catch((err) => {
        console.error(err);
        return { status: "error" as const, message: "エラーが発生しました" };
      });
  };

  return (
    <RegisterForm
      formName="会員登録"
      formType="new"
      onSubmit={onSubmit}
      successMessage={
        <>
          {email && (
            <Alert severity="info">
              {email} 宛に確認メールがが送信されました! ✈
            </Alert>
          )}
        </>
      }
    />
  );
};

export default Page;
