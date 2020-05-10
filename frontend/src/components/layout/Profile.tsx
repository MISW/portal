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
import { ConfigurableProfile, labelsInJapanese } from "../../user";
import NoWrapButton from "./NoWrapButton";

const useToolbarStyle = makeStyles(() =>
  createStyles({
    root: {},
    title: {
      flex: "1 1 100%",
    },
  })
);

const Profile: React.FC<{
  user: ConfigurableProfile;
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
          {labelsInJapanese
            .filter(({ id }) => (id as keyof ConfigurableProfile) in user)
            .map(({ id, label }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row" align="center">
                  <Box fontWeight="fontWeightBold">{`${label}`}</Box>
                </TableCell>
                <TableCell align="center">{`${
                  user[id as keyof ConfigurableProfile] ?? ""
                  }`}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Profile;
