import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Typography } from "@material-ui/core";
import AdminUsersTable, {
  HeadCell,
} from "../../src/components/layout/AdminUsersTable";
import { listUsers } from "../../src/network";
import { PaymentTableData } from "../../src/user";

const headCells: HeadCell[] = [
  {
    id: "id",
    label: "id",
  },
];

const Page: NextPage = () => {
  const [users, setUsers] = useState<Array<PaymentTableData> | null>(null);
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
      {users ? (
        <AdminUsersTable
          rows={users}
          headCells={headCells}
          defaultSortedBy={"id"}
        />
      ) : (
        "Loading"
      )}
    </>
  );
};

export default Page;
