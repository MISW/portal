import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import AdminUsersTable, {
  HeadCell,
} from "../../src/components/layout/AdminUsersTable";
import { listUsers } from "../../src/network";
import { PaymentTableData } from "../../src/user";

const headCells: HeadCell[] = [
  { id: "id", label: "id" },
  { id: "generation", label: "代" },
  { id: "handle", label: "ハンネ" },
  { id: "paid", label: "支払済" },
  { id: "authorizer", label: "納入確認者" },
  { id: "role", label: "role" },
  { id: "name", label: "氏名" },
  { id: "kana", label: "カナ" },
  { id: "sex", label: "性" },
  { id: "univName", label: "大学名" },
  { id: "department", label: "学部" },
  { id: "subject", label: "学科" },
  { id: "studentId", label: "学籍番号" },
  { id: "email", label: "email" },
  { id: "emergencyPhoneNumber", label: "緊急連絡先" },
  { id: "workshops", label: "研究会" },
  { id: "squads", label: "班" },
  { id: "otherCircles", label: "他サークル" },
  { id: "slackId", label: "slack id" },
  { id: "discordId", label: "discord id" },
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
      {users ? (
        <AdminUsersTable
          rows={users}
          headCells={headCells}
          defaultSortedBy={"id"}
        />
      ) : (
          "Loading..."
        )}
    </>
  );
};

export default Page;
