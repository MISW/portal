import React, { useEffect } from "react";
import { NextPage } from "next";
import { Typography } from "@material-ui/core";
import { useAuthCallback } from "features/auth";

const Page: NextPage = () => {
  const { handleCallback } = useAuthCallback();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (code == null || state == null) {
      throw new Error("There is no status and code in query parameter");
    }
    handleCallback(code, state);
  }, [handleCallback]);
  return (
    <>
      <Typography>Loading...</Typography>
    </>
  );
};

export default Page;
