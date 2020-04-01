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
  return <DefaultLayout>Trying Login...</DefaultLayout>;
};

export default Page;
