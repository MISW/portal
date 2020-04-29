import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import AdminUsersTable, {
  HeadCell,
  Data,
} from "../../src/components/layout/AdminUsersTable";
import {
  listUsers,
  getUserAsAdmin,
  addPaymentStatus,
  deletePaymentStatus,
} from "../../src/network";
import {
  PaymentTableData,
  toPaymentTableData,
  labelsInJapanese,
} from "../../src/user";

const headCells: HeadCell[] = Object.entries(labelsInJapanese).map(
  ([id, label]) => ({ id, label } as HeadCell)
);

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
      {users ? (
        <AdminUsersTable
          rows={users}
          headCells={headCells}
          defaultSortedBy={"id"}
          handleEditPaymnetStatus={async (id, status): Promise<Data> => {
            if (status) {
              await addPaymentStatus(id);
            } else {
              await deletePaymentStatus(id);
            }

            return toPaymentTableData(await getUserAsAdmin(id));
          }}
        />
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default Page;
