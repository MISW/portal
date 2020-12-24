import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import ky from "ky-universal";
import { useAuthCode } from "features/auth/useAuthCode";
import { Spinner } from "components/ui";

const CallbackPage: NextPage = () => {
  const router = useRouter();
  const { processAuthCode, error } = useAuthCode();

  // routerへの変更を加えるとrouterが変わってしまう
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (code == null || state == null) {
      router.push("/");
      return;
    }
    processAuthCode(code, state).then(() => {
      router.push("/");
    });
  }, [processAuthCode /* router */]);
  /* eslint-enable */

  useEffect(() => {
    if (error == null) return;
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

export default CallbackPage;
