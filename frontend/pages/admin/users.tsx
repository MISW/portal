import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Typography } from "@material-ui/core";
import AdminUsersTable from "../../src/components/layout/AdiminUsersTable";
import { listUsers } from "../../src/network";
import { UserWithPaymentJSON } from "../../src/user";

const Page: NextPage = () => {
  const [users, setUsers] = useState<Array<UserWithPaymentJSON> | null>(null);
  useEffect(() => {
    let unmounted = false;
    const getListUsers = async () => {
      const u = await listUsers();
      if (!unmounted) {
        setUsers(u);
      }
    };
    getListUsers();
    return () => {
      unmounted = true;
    };
  }, []);
  return (
    <>
      <Typography variant="h1">ユーザー一覧</Typography>
      <AdminUsersTable />
    </>
  );
};

export default Page;
