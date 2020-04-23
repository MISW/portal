import React from "react";
import NextLink from "next/link";
import Button from "@material-ui/core/Button";
import { NextPage } from "next";
import { Typography } from "@material-ui/core";

const Page: NextPage = () => {
  return (
    <>
      <Typography variant="h1">管理者画面</Typography>
      <NextLink href="/admin/users">
        <Button>ユーザー管理画面へ</Button>
      </NextLink>
    </>
  );
};

export default Page;
