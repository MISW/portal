import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Container, Typography, Box } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ConfigurableProfile, periodsInJapanese, PaymentStatus } from "../../user";
import NoWrapButton from "./NoWrapButton";

const useToolbarStyle = makeStyles(() =>
  createStyles({
    root: {},
    title: {
      flex: "1 1 100%",
    },
  })
);

const paymentStatusesStyle = makeStyles(() =>
  createStyles({
    fixedTable: {
      "table-layout": "fixed",
    },
  })
);

const PaymentStatuses: React.FC<{
  paymentStatuses: PaymentStatus[];
  editButton?: boolean;
  handleEditButton?: () => void;
}> = ({ paymentStatuses, editButton, handleEditButton }) => {
  const toolbarClasses = useToolbarStyle();
  const paymentStatusesClasses = paymentStatusesStyle();

  return (
    <Container maxWidth="md">
      <Toolbar className={toolbarClasses.root}>
        <Typography className={toolbarClasses.title} variant="h3">
          支払い履歴
        </Typography>
      </Toolbar>

      <Table className={clsx({ [paymentStatusesClasses.fixedTable]: paymentStatuses.length == 0 })} aria-label="user profile">
        <TableHead>
          <TableRow>
            <TableCell align="center">期間</TableCell>
            <TableCell align="center">承認者</TableCell>
            <TableCell align="center">承認日時</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paymentStatuses.length == 0 ?
            <TableRow key="empty">
              <TableCell component="th" scope="row" align="center" colSpan={3}>
                なし
              </TableCell>
            </TableRow>
            : paymentStatuses.map((value) => (
              <TableRow key={`${value.period}:${value.created_at}`}>
                <TableCell component="th" scope="row" align="center">
                  {`${periodsInJapanese(value.period)}`}
                </TableCell>
                <TableCell align="center">
                  {`${value.authorizer}`}
                </TableCell>
                <TableCell align="center">
                  {`${value.created_at}`}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default PaymentStatuses;
