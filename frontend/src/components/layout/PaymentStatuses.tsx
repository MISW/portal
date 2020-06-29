import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { periodsInJapanese } from "../../user";
import { PaymentStatus } from "models/user";

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
  paymentStatuses: readonly PaymentStatus[];
  editButton?: boolean;
  handleEditButton?: () => void;
}> = ({ paymentStatuses }) => {
  const toolbarClasses = useToolbarStyle();
  const paymentStatusesClasses = paymentStatusesStyle();

  return (
    <TableContainer>
      <Toolbar className={toolbarClasses.root}>
        <Typography className={toolbarClasses.title} variant="h3">
          支払い履歴
        </Typography>
      </Toolbar>

      <Table
        className={clsx({
          [paymentStatusesClasses.fixedTable]: paymentStatuses.length == 0,
        })}
        aria-label="user profile"
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">期間</TableCell>
            <TableCell align="center">承認者</TableCell>
            <TableCell align="center">承認日時</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paymentStatuses.length == 0 ? (
            <TableRow key="empty">
              <TableCell component="th" scope="row" align="center" colSpan={3}>
                なし
              </TableCell>
            </TableRow>
          ) : (
            paymentStatuses.map((value) => (
              <TableRow key={`${value.period}:${value.createdAt}`}>
                <TableCell component="th" scope="row" align="center">
                  {`${periodsInJapanese(value.period)}`}
                </TableCell>
                <TableCell align="center">{`${value.authorizer}`}</TableCell>
                <TableCell align="center">{`${value.createdAt}`}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentStatuses;
