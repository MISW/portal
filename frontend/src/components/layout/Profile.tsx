import React from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Container, Typography, Box } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Table from "@material-ui/core/Table";
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
}> = ({ user, editButton, handleEditButton }) => {
  const toolbarClasses = useToolbarStyle();

  return (
    <Container maxWidth="md">
      <Toolbar className={toolbarClasses.root}>
        <Typography className={toolbarClasses.title} variant="h3">
          ユーザ情報
        </Typography>

        {editButton ? (
          <NoWrapButton
            variant="outlined"
            color="primary"
            onClick={() => {
              if (handleEditButton) handleEditButton();
            }}
          >
            変更
          </NoWrapButton>
        ) : null}
      </Toolbar>

      <Table aria-label="user profile">
        <TableHead>
          <TableRow>
            <TableCell align="center">Key</TableCell>
            <TableCell align="center">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(user as ConfigurableProfile).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell component="th" scope="row" align="center">
                <Box fontWeight="fontWeightBold">{`${
                  labelsInJapanese[key as keyof typeof labelsInJapanese]
                  }`}</Box>
              </TableCell>
              <TableCell align="center">{`${value ? value : ""}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Profile;
