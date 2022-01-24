import React, { useCallback } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import {
  IconButton,
  MenuItem,
  Menu,
  Container,
  Tooltip,
  CssBaseline,
  Avatar,
} from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";
import MUILink from "@mui/material/Link";
import lighttheme from "../theme/lighttheme";
import darktheme from "../theme/darktheme";
import { useSystemColorScheme } from "../../hooks/theme";
import { getSuffix } from "../../utils";
import NextLink from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/currentUser";

const PREFIX = "DefaultLayout";

const classes = {
  appBar: `${PREFIX}-appBar`,
  menuButton: `${PREFIX}-menuButton`,
  layout: `${PREFIX}-layout`,
  title: `${PREFIX}-title`,
};

const StyledStyledEngineProvider = styled(StyledEngineProvider)(
  ({ theme }) => ({
    [`& .${classes.appBar}`]: {
      position: "relative",
      flexGrow: 1,
    },

    [`& .${classes.menuButton}`]: {
      marginRight: theme.spacing(2),
    },

    [`& .${classes.layout}`]: {
      width: "auto",
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        // width: 600,
        marginLeft: "auto",
        marginRight: "auto",
      },
    },

    [`& .${classes.title}`]: {
      flexGrow: 1,
    },
  })
);

const Copyright: React.FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <MUILink color="inherit" href="https://misw.jp/" underline="hover">
        MISW
      </MUILink>{" "}
        2020-2022
      {"."}
    </Typography>
  );
};

export const DefaultLayout: React.FC<{ onLogout: () => void }> = ({
  children,
  onLogout,
}) => {
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
      <ThemeProvider theme={scheme === "dark" ? darktheme : lighttheme}>
        <CssBaseline />
        <div>
          <AppBar position="fixed" color="primary" className={classes.appBar}>
            <Toolbar>
              <div className={classes.title}>
                <NextLink href="/" passHref>
                  <MUILink variant="h6" color="inherit" underline="hover" align="center">
                    みすポータル  
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
                      <Typography variant="h6" color="inherit" align="right" sx={{ flexGrow: 1 }}>
                        {` ${handle} (${status}) `}
                      </Typography>
                      <div>
                        {role === "admin" && (
                          <NextLink href="/admin" passHref>
                            <Tooltip title="管理者" placement="right-end">
                              <IconButton
                                component="a"
                                aria-label="admin"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color="secondary"
                                size="large"
                              >
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
                          <NextLink passHref href="/card">
                            <MenuItem component="a" onClick={handleClose}>
                              Card
                            </MenuItem>
                          </NextLink>
                          <MenuItem onClick={handleLogout}>
                            Log out
                          </MenuItem>
                        </Menu>
                      </div>
                    </>
                  );
                })()}
            </Toolbar>
          </AppBar>
          <main className={classes.layout}>
            <Container maxWidth="xl">
              <>{children}</>
            </Container>
          </main>
          <footer>
            <Copyright />
          </footer>
        </div>
      </ThemeProvider>
    </StyledStyledEngineProvider>
  );
};
