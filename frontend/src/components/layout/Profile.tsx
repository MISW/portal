import React from "react";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Typography, Box } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import NoWrapButton from "./NoWrapButton";
import { User } from "models/user";

const useToolbarStyle = makeStyles(() =>
  createStyles({
    root: {},
    title: {
      flex: "1 1 100%",
    },
  })
);

const RowItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <TableRow>
    <TableCell component="th" scope="row" align="center">
      <Box fontWeight="fontWeightBold">{label}</Box>
    </TableCell>
    <TableCell align="center">{value}</TableCell>
  </TableRow>
);

const Profile: React.FC<{
  user: User;
  editButton?: boolean;
  handleEditButton?: () => void;
  title?: boolean;
  size?: "small" | "medium";
}> = ({ user, editButton, handleEditButton, title, size }) => {
  const toolbarClasses = useToolbarStyle();

  title = title ?? true;
  size = size ?? "medium";

  return (
    <TableContainer>
      {title ? (
        <Toolbar className={toolbarClasses.root}>
          <Typography className={toolbarClasses.title} variant="h3">
            ユーザ情報
          </Typography>

          {editButton ? (
            <NoWrapButton
              variant="outlined"
              color="inherit"
              onClick={() => {
                if (handleEditButton) handleEditButton();
              }}
            >
              変更
            </NoWrapButton>
          ) : null}
        </Toolbar>
      ) : (
        <></>
      )}

      <Table aria-label="user profile" size={size}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Key</TableCell>
            <TableCell align="center">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <RowItem label="ID" value={user.id} />
          <RowItem label="代" value={user.generation} />
          <RowItem label="ハンドル" value={user.handle} />
          <RowItem label="権限" value={user.role} />
          <RowItem label="氏名" value={user.name} />
          <RowItem label="氏名(カナ)" value={user.kana} />
          <RowItem label="性別" value={user.sex} />
          <RowItem label="大学名" value={user.university.name} />
          <RowItem label="学部" value={user.university.department} />
          <RowItem label="学科" value={user.university.subject} />
          <RowItem label="学籍番号" value={user.studentId} />
          <RowItem label="Email" value={user.email} />
          <RowItem label="緊急連絡先" value={user.emergencyPhoneNumber} />
          <RowItem label="研究会" value={user.workshops.join(", ")} />
          <RowItem label="班" value={user.squads.join(", ")} />
          <RowItem label="他サークル" value={user.otherCircles} />
          <RowItem label="Slack ID" value={user.slackId} />
          <RowItem label="Discord ID" value={user.discordId ?? "未設定"} />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Profile;
