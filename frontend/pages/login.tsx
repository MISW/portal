import React, { useEffect } from "react";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";
import { NextPage } from "next";
import { login } from "../src/network";

const Page: NextPage = () => {
  useEffect(() => {
    login().catch((err) => {
      throw err;
    });
  });
  return <>Trying Login...</>;
};

export default Page;
