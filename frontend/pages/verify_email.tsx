import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const [state, setState] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const router = useRouter();
  useEffect(() => {
    const sendEmailToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      if (token === null) {
        console.error("token is not set");
        setState("error");
        return;
      }
      const res = await fetch(
        `${location.protocol}//${location.host}/api/public/verify_email`,
        {
          headers: {
            Accept: "application/json, */*",
            "Content-type": "application/json",
          },
          credentials: "include",
          method: "POST",
          body: JSON.stringify({ token }),
        }
      );
      const body = await res.json();
      if (res.status >= 400) {
        console.error(body);
        setState("error");
        return;
      }
      setState("success");
      await router.push("/");
    };
    sendEmailToken().catch((err) => {
      throw err;
    });
  }, [router]);
  return (
    <>
      {state === "success" ? (
        <>
          <Alert severity="success">メールアドレスが認証出来ました!</Alert>
        </>
      ) : state === "error" ? (
        <>
          <Alert severity="error">
            <AlertTitle>エラーが発生しました</AlertTitle>
            info@misw.jp や Twitter @misw_info または
            Discordへ問題を報告してください....
          </Alert>
        </>
      ) : (
        <p>loading</p>
      )}
    </>
  );
};

export default Page;
