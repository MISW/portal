import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import AdminUsersTable, {
  HeadCell,
  Data,
  handleClickMenuParam,
} from "../../src/components/layout/AdminUsersTable";
import {
  listUsers,
  getUserAsAdmin,
  addPaymentStatus,
  deletePaymentStatus,
  inviteToSlack,
  remindPayment,
} from "../../src/network";
import {
  UserTableData,
  toUserTableData,
  labelsInJapanese,
} from "../../src/user";
import { usersCSV, saveFile } from "../../src/util";
import { Typography } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import SlackInvitationDialog from "../../src/components/layout/SlackInvitationDialog";
import RemindPaymentDialog from "../../src/components/layout/RemindPaymentDialog";

const headCells: HeadCell[] = labelsInJapanese.map(
  ({ id, label }) => ({ id, label } as HeadCell)
);

const Page: NextPage = () => {
  const [users, setUsers] = useState<Array<UserTableData> | null>(null);
  const [slackInvitationDialog, setSlackInvitationDialog] = useState<boolean>(
    false
  );
  const [remindPaymentDialog, setRemindPaymentDialog] = useState<boolean>(
    false
  );

  const handleClickMenu = (param: handleClickMenuParam) => {
    switch (param.kind) {
      case "slack":
        setSlackInvitationDialog(true);
        break;
      case "export":
        saveFile("members.csv", usersCSV(users ?? []));
        break;
      case "remind_payment":
        setRemindPaymentDialog(true);
        break;
    }
  };

  const handleSlackInvitationClose = (value: "OK" | "Cancel") => {
    if (value === "OK") {
      inviteToSlack().then();
    }
    setSlackInvitationDialog(false);
  };
  const handleRemindPaymentDialogClose = (value: "OK" | "Cancel") => {
    if (value === "OK") {
      remindPayment().then();
    }
    setRemindPaymentDialog(false);
  };

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

  const invitedUsers =
    users
      ?.filter(
        (user) =>
          ["admin", "member"].includes(user.role) &&
          user.slackId.length === 0 &&
          user.slackInvitationStatus === "never"
      )
      .map((user) => ({
        id: user.id,
        description: `${user.generation}代 ${user.handle}(${user.name}): ${user.email}`,
      })) ?? [];

  const targetUsers =
    users
      ?.filter(
        (user) => ["admin", "member"].includes(user.role) && user.paid === "NO"
      )
      .map((user) => ({
        id: user.id,
        description: `${user.generation}代 ${user.handle}(${user.name}): ${user.email}`,
      })) ?? [];

  return (
    <>
      <Toolbar>
        <Typography variant="h3">ユーザ一覧</Typography>
      </Toolbar>
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

            const user = toUserTableData(await getUserAsAdmin(id));

            setUsers(users.map((u) => (u.id == user.id ? user : u)));

            return user;
          }}
          handleClickMenu={handleClickMenu}
        />
      ) : (
        "Loading..."
      )}

      <SlackInvitationDialog
        open={slackInvitationDialog}
        onClose={handleSlackInvitationClose}
        invitedUsers={invitedUsers}
      />
      <RemindPaymentDialog
        open={remindPaymentDialog}
        onClose={handleRemindPaymentDialogClose}
        targetUsers={targetUsers}
      />
    </>
  );
};

export default Page;
