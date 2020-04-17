import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import RegisterForm, {
  SubmitResult,
} from "../src/components/layout/RegisterForm";
import { UserProfile } from "../src/user";
import { getProfile, updateProfile } from "../src/network";
import { Alert } from "@material-ui/lab";

const Page: NextPage = () => {
  const [user, setUser] = useState<UserProfile>();
  useEffect(() => {
    getProfile().then((u) => setUser(u));
  }, []);
  const onSubmit = (user: UserProfile): Promise<SubmitResult> => {
    return updateProfile(user)
      .then((u) => {
        console.log(u);
        return { status: "success" as const };
      })
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
