import { useCallback } from 'react';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { IconButton, MenuItem, Menu, Container, Tooltip, CssBaseline, Avatar } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import MUILink from '@mui/material/Link';
import lighttheme from '../theme/lighttheme';
import darktheme from '../theme/darktheme';
import { useSystemColorScheme } from '../../hooks/theme';
import { getSuffix } from '../../utils';
import NextLink from 'next/link';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/currentUser';

const PREFIX = 'DefaultLayout';

const classes = {
  appBar: `${PREFIX}-appBar`,
  menuButton: `${PREFIX}-menuButton`,
  layout: `${PREFIX}-layout`,
  title: `${PREFIX}-title`,
};

const StyledStyledEngineProvider = styled(StyledEngineProvider)(({ theme }) => ({
  [`& .${classes.appBar}`]: {
    position: 'relative',
    flexGrow: 1,
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
  },

  [`& .${classes.layout}`]: {
    width: 'auto',
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      // width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  [`& .${classes.title}`]: {
    flexGrow: 1,
  },
}));

const Copyright: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright (c) 2020-2023, '}
      <MUILink color="inherit" href="https://misw.jp/" underline="hover">
        MIS.W（早稲田大学経営情報学会）
      </MUILink>
    </Typography>
  );
};

export const DefaultLayout: React.FC<
  React.PropsWithChildren<{
    onLogout: () => void;
  }>
> = ({ children, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const currentUser = useSelector(selectCurrentUser);

  const handleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    handleClose();
    onLogout();
  }, [handleClose, onLogout]);

  const scheme = useSystemColorScheme();

  return (
    <StyledStyledEngineProvider injectFirst>
      <ThemeProvider theme={scheme === 'dark' ? darktheme : lighttheme}>
        <CssBaseline />
        <div>
          <AppBar position="fixed" color="primary" enableColorOnDark className={classes.appBar}>
            <Toolbar>
              <div className={classes.title}>
                <NextLink href="/" passHref legacyBehavior>
                  <MUILink variant="h6" color="inherit" underline="hover" align="center">
                    みすポータル
                  </MUILink>
                </NextLink>
              </div>
              {currentUser &&
                (() => {
                  const { generation, role, handle, avatar } = currentUser;
                  const status = role === 'member' || role === 'retired' ? `${generation}${getSuffix(generation)}` : role;
                  return (
                    <>
                      <Typography
                        variant="h6"
                        color="inherit"
                        align="right"
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        {` ${handle} (${status}) `}
                      </Typography>
                      <div>
                        {role === 'admin' && (
                          <NextLink href="/admin" passHref legacyBehavior>
                            <Tooltip title="管理者" placement="right-end">
                              <IconButton component="a" aria-label="admin" aria-controls="menu-appbar" aria-haspopup="true" color="secondary" size="large">
                                <Lock />
                              </IconButton>
                            </Tooltip>
                          </NextLink>
                        )}
                        <Tooltip title="各種設定" placement="right-end">
                          <IconButton
                            title={handle}
                            aria-label={handle}
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                            size="large"
                          >
                            {avatar != null ? <Avatar alt={handle} src={avatar.thumbnailUrl} /> : <AccountCircle />}
                          </IconButton>
                        </Tooltip>
                        <Menu
                          id="menu-appbar"
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          open={open}
                          onClose={handleClose}
                        >
                          <NextLink passHref href="/profile" legacyBehavior>
                            <MenuItem component="a" onClick={handleClose}>
                              Profile
                            </MenuItem>
                          </NextLink>
                          <NextLink passHref href="/card" legacyBehavior>
                            <MenuItem component="a" onClick={handleClose}>
                              Card
                            </MenuItem>
                          </NextLink>
                          <MenuItem onClick={handleLogout}>Log out</MenuItem>
                        </Menu>
                      </div>
                    </>
                  );
                })()}
            </Toolbar>
          </AppBar>
          <Toolbar /*このToolBarがないと、header(AppBarタグ(中のToolBar))がmainタグの上に覆い被さる。参考: https://mui.com/components/app-bar/*/ />
          <main className={classes.layout}>
            <Container className="mt-2" maxWidth="xl">
              <>{children}</>
            </Container>
          </main>
          <footer className="bg-sky-600 table-footer-group fixed inset-x-0 bottom-0" color="primary">
            <Copyright />
          </footer>
        </div>
      </ThemeProvider>
    </StyledStyledEngineProvider>
  );
};
