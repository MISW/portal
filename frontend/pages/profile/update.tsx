import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import RegisterForm, {
  SubmitResult,
} from "../../src/components/layout/RegisterForm";
import { ConfigurableProfile } from "../../src/user";
import { getProfile, updateProfile } from "../../src/network";
import { Alert } from "@material-ui/lab";

const Page: NextPage = () => {
  const [user, setUser] = useState<ConfigurableProfile>();
  useEffect(() => {
    getProfile().then((u) => setUser(u));
  }, []);
  const onSubmit = (user: ConfigurableProfile): Promise<SubmitResult> => {
    return updateProfile(user)
      .then(() => ({ status: "success" as const }))
      .catch((err) => {
        console.error(err);
        return { status: "error", message: "エラーが発生しました" };
      });
  };
  return (
    <>
      {!user ? (
        "Loading..."
      ) : (
        <RegisterForm
          formName="会員情報設定"
          formType="setting"
          user={user}
          onSubmit={onSubmit}
          successMessage={
            <Alert severity="success">プロフィールが変更されました!</Alert>
          }
        />
      )}
    </>
  );
};

export default Page;
