import React from "react";
import { NextPage } from "next";
import { Typography } from "@material-ui/core";
import AdminUsersTable from "../../src/components/layout/AdiminUsersTable";

const Page: NextPage = () => {
  return (
    <>
      <Typography variant="h1">ユーザー一覧</Typography>
      <AdminUsersTable />
    </>
  );
};

export default Page;
