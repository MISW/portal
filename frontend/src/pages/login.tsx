import React, { useEffect } from "react";
import type { NextPage } from "next";
import ky from "ky-universal";
import { useLogin } from "features/auth/useLogin";
import { Spinner } from "components/ui";

const Login: NextPage = () => {
  const { login, error } = useLogin();

  useEffect(() => {
    login();
  }, [login]);

  useEffect(() => {
    console.error(error);
    if (error instanceof ky.HTTPError) {
      error.response.json().then((json) => {
        alert(json.message);
      });
    }
  }, [error]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col items-center space-y-4">
        <p>ログインしています……</p>
        <Spinner />
      </div>
    </div>
  );
};

export default Login;
