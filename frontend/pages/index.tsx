import React from "react";
import { DefaultLayout } from "../src/components/layout/DefaultLayout";
import NextLink from "next/link";
import Button from "@material-ui/core/Button";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <DefaultLayout>
      <h1>ここにすばらしいポータルサイトができます</h1>
      <NextLink href="/setting">
        <Button className="button" variant="contained" color="primary">
          会員情報設定
        </Button>
      </NextLink>
    </DefaultLayout>
  );
};

export default Page;
