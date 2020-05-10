import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Alert } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import Link from "next/link";

const Page: NextPage = () => {
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    const sendEmailToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      if (token === null) {
        throw new Error("There is no status and code in query parameter");
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
        console.error(res);
        throw new Error(`Status >= 400 message = ${body.message}`);
      }
      console.log(body);
      setVerified(true);
    };
    sendEmailToken().catch((err) => {
      throw err;
    });
  }, []);
  return (
    <>
      {verified ? (
        <>
          <Alert severity="success">メールアドレスが認証出来ました!</Alert>
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </>
      ) : (
        <p>loading</p>
      )}
    </>
  );
};

export default Page;
