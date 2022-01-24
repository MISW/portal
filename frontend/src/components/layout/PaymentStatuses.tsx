import React from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { periodsInJapanese } from '../../user';
import { PaymentStatus } from 'models/user';
import { makeStyles, createStyles } from '@mui/styles';

const PREFIX = 'PaymentStatuses';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
};

const StyledTableContainer = styled(TableContainer)(() => ({
  [`& .${classes.root}`]: {},

  [`& .${classes.title}`]: {
    flex: '1 1 100%',
  },
}));

const useToolbarStyle = makeStyles(() => ({
  [`& .${classes.root}`]: {},

  [`& .${classes.title}`]: {
    flex: '1 1 100%',
  },
}));

const paymentStatusesStyle = makeStyles(() =>
  createStyles({
    fixedTable: {
      'table-layout': 'fixed',
    },
  }),
);

const PaymentStatuses: React.FC<{
  paymentStatuses: readonly PaymentStatus[];
  editButton?: boolean;
  handleEditButton?: () => void;
}> = ({ paymentStatuses }) => {
  const toolbarClasses = useToolbarStyle();
  const paymentStatusesClasses = paymentStatusesStyle();

  return (
    <StyledTableContainer>
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
    </StyledTableContainer>
  );
};

export default PaymentStatuses;
