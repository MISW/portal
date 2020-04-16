import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import { NextPage } from "next";

const Page: NextPage = () => {
  const router = useRouter();
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
      await router.push("/");
    };
    sendEmailToken().catch((err) => {
      throw err;
    });
  });
  return (
    <>
      <Typography>verify email</Typography>

      <Typography>Loading...</Typography>
    </>
  );
};

export default Page;
