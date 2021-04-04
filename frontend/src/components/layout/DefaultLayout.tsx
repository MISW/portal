import React, { useCallback } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, MuiThemeProvider } from "@material-ui/core/styles";
import {
  IconButton,
  MenuItem,
  Menu,
  Container,
  Tooltip,
  CssBaseline,
  Avatar,
} from "@material-ui/core";
import { AccountCircle, Lock } from "@material-ui/icons";
import MUILink from "@material-ui/core/Link";
import lighttheme from "../theme/lighttheme";
import darktheme from "../theme/darktheme";
import { useSystemColorScheme } from "../../hooks/theme";
import { getSuffix } from "../../utils";
import NextLink from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/currentUser";

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    position: "relative",
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  layout: {
    width: "auto",
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      // width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  title: {
    flexGrow: 1,
  },
}));

const Copyright: React.FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <MUILink color="inherit" href="https://misw.jp">
        MISW
      </MUILink>{" "}
      2020-2021
      {"."}
    </Typography>
  );
};

export const DefaultLayout: React.FC<{ onLogout: () => void }> = ({
  children,
  onLogout,
}) => {
  const classes = useStyles();
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
    <MuiThemeProvider theme={scheme === "dark" ? darktheme : lighttheme}>
      <CssBaseline />
      <div className="container">
        <AppBar position="fixed" color="primary" className={classes.appBar}>
          <Toolbar>
            <div className={classes.title}>
              <NextLink href="/" passHref>
                <MUILink variant="h6" color="inherit">
                  MISW Portal
                </MUILink>
              </NextLink>
            </div>
            {currentUser &&
              (() => {
                const { generation, role, handle, avatar } = currentUser;
                const status =
                  role === "member" || role === "retired"
                    ? `${generation}${getSuffix(generation)}`
                    : role;
                return (
                  <>
                    <Typography variant="h6" color="inherit">
                      {`<${status}> ${handle}`}
                    </Typography>
                    <div>
                      {role === "admin" && (
                        <NextLink href="/admin" passHref>
                          <Tooltip title="管理者">
                            <IconButton
                              component="a"
                              aria-label="admin"
                              aria-controls="menu-appbar"
                              aria-haspopup="true"
                              color="secondary"
                            >
                              <Lock />
                            </IconButton>
                          </Tooltip>
                        </NextLink>
                      )}
                      <Tooltip title="各種設定">
                        <IconButton
                          title={handle}
                          aria-label={handle}
                          aria-controls="menu-appbar"
                          aria-haspopup="true"
                          onClick={handleMenu}
                          color="inherit"
                        >
                          {avatar != null ? (
                            <Avatar alt={handle} src={avatar.thumbnailUrl} />
                          ) : (
                            <AccountCircle />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={open}
                        onClose={handleClose}
                      >
                        <NextLink passHref href="/profile">
                          <MenuItem component="a" onClick={handleClose}>
                            Profile
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
        <main className={classes.layout}>
          <Container maxWidth="lg">
            <>{children}</>
          </Container>
        </main>
        <footer>
          <Copyright />
        </footer>
      </div>
    </MuiThemeProvider>
  );
};
