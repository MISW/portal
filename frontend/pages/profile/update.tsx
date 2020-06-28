import React from "react";
import { NextPage } from "next";
import { Alert } from "@material-ui/lab";
import RegisterForm, {
  SubmitResult,
} from "../../src/components/layout/RegisterForm";
import { ConfigurableProfile } from "../../src/user";
import { updateProfile } from "../../src/network";
import { withLogin } from "../../src/middlewares/withLogin";
import { useCurrentUser, useFetchCurrentUser } from "features/currentUser";
import { nonNullOrThrow } from "utils";

const Page: NextPage = () => {
  const currentUser = nonNullOrThrow(useCurrentUser());
  const fetchCurrentUser = useFetchCurrentUser();
  const onSubmit = async (user: ConfigurableProfile): Promise<SubmitResult> => {
    try {
      await updateProfile(user);
      fetchCurrentUser([]).catch((e) => console.error(e));
      return { status: "success" as const };
    } catch (e) {
      console.error(e);
      return { status: "error", message: "エラーが発生しました" };
    }
  };
  return (
    <RegisterForm
      formName="会員情報設定"
      formType="setting"
      user={currentUser}
      onSubmit={onSubmit}
      successMessage={
        <Alert severity="success">プロフィールが変更されました!</Alert>
      }
    />
  );
};

export default withLogin(Page);
