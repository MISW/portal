import React from "react";
import NextLink from "next/link";
import Button from "@material-ui/core/Button";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <>
      <h1>ここにすばらしいポータルサイトができます</h1>
      <NextLink href="/profile">
        <Button className="button" variant="contained" color="primary">
          会員情報設定
        </Button>
      </NextLink>
    </>
  );
};

export default Page;
