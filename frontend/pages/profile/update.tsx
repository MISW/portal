import React from "react";
import { Alert } from "@material-ui/lab";
import RegisterForm, {
  SubmitResult,
} from "../../src/components/layout/RegisterForm";
import { ConfigurableProfile } from "../../src/user";
import { updateProfile } from "../../src/network";
import {
  withLogin,
  NextPageWithUserInfo,
} from "../../src/middlewares/withLogin";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "features/currentUser";

const Page: NextPageWithUserInfo = ({ currentUser }) => {
  const dispatch = useDispatch();
  const onSubmit = async (user: ConfigurableProfile): Promise<SubmitResult> => {
    try {
      await updateProfile(user);
      dispatch(fetchCurrentUser());
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
