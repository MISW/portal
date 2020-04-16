import React, { useContext, useCallback } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { IconButton, MenuItem, Menu } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MUILink from "@material-ui/core/Link";
import NextLink from "next/link";
import { loginContext } from "../../../pages/_app";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    postion: "relative",
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
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

export const DefaultLayout: React.FC = ({ children }) => {
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
  const handleClickProfile = useCallback(() => router.push("/"), [router]);
  const handleClickLogout = useCallback(() => console.log("TODO:"), []);

  return (
    <>
      <div className="container">
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <NextLink href="/">
              <Typography variant="h6" color="inherit" className={classes.title}>
                MISW Portal
              </Typography>
            </NextLink>
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
                {/* // TODO: うまくクリックに反応しなかった気がする */}
                <MenuItem onClick={handleClickProfile}>Profile</MenuItem>
                {isLogin && (
                  <MenuItem>
                    <a>Log out(TODO:)</a>
                  </MenuItem>
                )}
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <main className={classes.layout}>{children}</main>
      <Copyright />
    </>
  );
};
