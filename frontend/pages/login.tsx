import React, { useEffect } from "react";
import { NextPage } from "next";
import { login } from "../src/network";

const Page: NextPage = () => {
  useEffect(() => {
    login().catch((err) => {
      throw err;
    });
  }, []);
  return <>Trying Login...</>;
};

export default Page;
