import React, { useContext, useCallback } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, MuiThemeProvider } from "@material-ui/core/styles";
import {
  IconButton,
  MenuItem,
  Menu,
  Container,
  CssBaseline,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MUILink from "@material-ui/core/Link";
import lighttheme from "../theme/lighttheme";
import darktheme from "../theme/darktheme";
import { loginContext } from "../../../pages/_app";
import { useRouter } from "next/router";
import { useSystemColorScheme } from "../../hooks/theme";

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
      2020
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
  const isLogin = useContext(loginContext);
  const router = useRouter();

  const handleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClickTitle = useCallback(() => router.push("/"), [router]);

  const handleClickProfile = useCallback(() => {
    handleClose();
    router.push("/profile");
  }, [handleClose, router]);

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
            {/* <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton> */}
            <Typography
              variant="h6"
              color="inherit"
              className={classes.title}
              onClick={handleClickTitle}
            >
              MISW Portal
            </Typography>
            {isLogin && (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
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
                  <MenuItem onClick={handleClickProfile}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <main className={classes.layout}>
          <Container maxWidth="lg">{children}</Container>
        </main>
        <footer>
          <Copyright />
        </footer>
      </div>
    </MuiThemeProvider>
  );
};
