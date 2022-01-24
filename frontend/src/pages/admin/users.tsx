import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import AdminUsersTable, {
  HeadCell,
  Data,
  handleClickMenuParam,
} from "components/layout/AdminUsersTable";
import { UserTableData, labelsInJapanese } from "user";
import { usersCSV, saveFile, nonNullOrThrow } from "utils";
import { Typography } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import SlackInvitationDialog from "components/layout/SlackInvitationDialog";
import RemindPaymentDialog from "components/layout/RemindPaymentDialog";
import { withLogin } from "middlewares/withLogin";
import { User } from "models/user";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  selectAllUsers,
  fetchAllUsers,
  addPaymentStatus,
  deletePaymentStatus,
  selectUserById,
} from "features/users";
import { inviteToSlack, remindPayment } from "features/admin";
import { NoSSR } from "components/utils/NoSSR";

const headCells: HeadCell[] = labelsInJapanese.map(
  ({ id, label }) => ({ id, label } as HeadCell)
);

const toTableData = (u: User): UserTableData => ({
  discordId: "",
  ...u,
  univName: u.university.name,
  department: u.university.department,
  subject: u.university.subject,
  workshops: u.workshops.join(", "),
  squads: u.squads.join(", "),
  authorizer: u.paymentStatus?.authorizer ?? "",
  paid: u.paymentStatus ? "YES" : "NO",
});

const Page: NextPage = () => {
  const users = useSelector(selectAllUsers);
  const store = useStore();
  const dispatch = useDispatch();
  useEffect(() => {
    const thunkAction = dispatch(fetchAllUsers());
    return () => thunkAction.abort();
  }, [dispatch]);
  const [slackInvitationDialog, setSlackInvitationDialog] =
    useState<boolean>(false);
  const [remindPaymentDialog, setRemindPaymentDialog] =
    useState<boolean>(false);

  const handleClickMenu = (param: handleClickMenuParam) => {
    switch (param.kind) {
      case "slack":
        setSlackInvitationDialog(true);
        break;
      case "export":
        saveFile("members.csv", usersCSV(users.map(toTableData)));
        break;
      case "remind_payment":
        setRemindPaymentDialog(true);
        break;
    }
  };

  const handleSlackInvitationClose = (value: "OK" | "Cancel") => {
    if (value === "OK") {
      dispatch(inviteToSlack());
    }
    setSlackInvitationDialog(false);
  };
  const handleRemindPaymentDialogClose = (value: "OK" | "Cancel") => {
    if (value === "OK") {
      dispatch(remindPayment());
    }
    setRemindPaymentDialog(false);
  };

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
        (user) =>
          ["admin", "member"].includes(user.role) && user.paymentStatus == null
      )
      .map((user) => ({
        id: user.id,
        description: `${user.generation}代 ${user.handle}(${user.name}): ${user.email}`,
      })) ?? [];

  return (
    <NoSSR>
      <Toolbar>
        <Typography variant="h3">ユーザ一覧</Typography>
      </Toolbar>
      {users ? (
        <AdminUsersTable
          rows={users.map(toTableData)}
          headCells={headCells}
          defaultSortedBy={"id"}
          handleEditPaymnetStatus={async (id, status): Promise<Data> => {
            if (status) {
              await dispatch(addPaymentStatus({ targetUserId: id }));
            } else {
              await dispatch(deletePaymentStatus({ targetUserId: id }));
            }

            const user = toTableData(
              nonNullOrThrow(selectUserById(store.getState(), id))
            );

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
    </NoSSR>
  );
};

export default withLogin(Page);
