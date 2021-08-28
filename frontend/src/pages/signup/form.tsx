import React, { useState } from "react";
import { NextPage } from "next";
import RegisterForm, { SubmitResult } from "components/layout/RegisterForm";
import { ConfigurableProfile } from "user";
import { Alert } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import { signup } from "features/auth";
import { NoSSR } from "components/utils/NoSSR";

const Page: NextPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>();
  const onSubmit = async (user: ConfigurableProfile): Promise<SubmitResult> => {
    try {
      await dispatch(
        signup({
          ...user,
          university: {
            name: user.univName,
            department: user.department,
            subject: user.subject,
          },
        })
      );
      setEmail(user.email);
      return { status: "success" as const };
    } catch (err) {
      console.error(err);
      return { status: "error" as const, message: "エラーが発生しました" };
    }
  };

  return (
    <NoSSR>
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
    </NoSSR>
  );
};

export default Page;
