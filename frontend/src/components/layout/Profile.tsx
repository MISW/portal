import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import NoWrapButton from './NoWrapButton';
import { User } from 'models/user';
import { makeStyles } from 'tss-react/mui';

const PREFIX = 'Profile';

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

const useToolbarStyle = makeStyles()(() => ({
  [`& .${classes.root}`]: {},

  [`& .${classes.title}`]: {
    flex: '1 1 100%',
  },
}));

const RowItem: React.FC<
  React.PropsWithChildren<{
    label: string;
    value: string | number;
  }>
> = ({ label, value }) => (
  <TableRow>
    <TableCell component="th" scope="row" align="center">
      <Box fontWeight="fontWeightBold">{label}</Box>
    </TableCell>
    <TableCell align="center">{value}</TableCell>
  </TableRow>
);

const Profile: React.FC<
  React.PropsWithChildren<{
    user: User;
    editButton?: boolean;
    handleEditButton?: () => void;
    title?: boolean;
    size?: 'small' | 'medium';
  }>
> = ({ user, editButton, handleEditButton, title, size }) => {
  const { classes: toolbarClasses } = useToolbarStyle();

  title = title ?? true;
  size = size ?? 'medium';

  return (
    <StyledTableContainer>
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

      <Table aria-label="user profile" size={size} className="dark:bg-black">
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
          <RowItem label="研究会" value={user.workshops.join(', ')} />
          <RowItem label="班" value={user.squads.join(', ')} />
          <RowItem label="他サークル" value={user.otherCircles} />
          <RowItem label="Account ID" value={user.accountId} />
          <RowItem label="Discord ID" value={user.discordId ?? '未設定'} />
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default Profile;
