import React, { useEffect } from "../src_furui/react";
import { NextPage } from "../src_furui/next";
import { useLogin } from "../src_furui/features/auth";

const Page: NextPage = () => {
  const { login } = useLogin();
  useEffect(() => {
    login();
  }, [login]);
  return <>Trying Login...</>;
};

export default Page;
