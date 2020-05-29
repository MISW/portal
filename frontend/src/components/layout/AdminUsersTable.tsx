import React from "react";
import clsx from "clsx";
import {
  createStyles,
  lighten,
  makeStyles,
  withStyles,
  Theme,
} from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import NoWrapButton from "./NoWrapButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { UserTableData } from "../../user";

export type handleClickMenuParam = { kind: "slack" } | { kind: "export" } | { kind: "remind_payment" };

export type handleClickMenuType = (param: handleClickMenuParam) => void;

export type Data = UserTableData extends Record<string, string | number> & {
  id: number;
}
  ? UserTableData
  : never;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export interface HeadCell {
  id: keyof Data;
  label: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 3000,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    tableWrapper: {
      maxHeight: 1080,
      overflow: "auto",
    },
  })
);

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: Array<HeadCell>;
  disabledCheckbox: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    disabledCheckbox,
  } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            disabled={disabledCheckbox}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={"none"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
    title: {
      flex: "1 1 100%",
    },
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  editMode: boolean;
  handleClickOnEditMode: () => void;
  handleClickMenu: handleClickMenuType;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    editMode,
    handleClickOnEditMode,
    handleClickMenu,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (name: "slack" | "export" | "remind_payment" | null) => () => {
    setAnchorEl(null);

    switch (name) {
      case "slack":
        handleClickMenu({ kind: "slack" });
        break;
      case "export":
        handleClickMenu({ kind: "export" });
        break;
      case "remind_payment":
        handleClickMenu({ kind: "remind_payment" });
        break;
    }
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <>
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>

          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
          <>
            <Tooltip title="Filter list">
              <IconButton aria-label="filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <div className={classes.title}></div>
            <NoWrapButton
              variant="contained"
              color={editMode ? "primary" : "default"}
              onClick={handleClickOnEditMode}
            >
              {editMode ? "終了" : "支払い登録モード"}
            </NoWrapButton>

            <Box ml={1}>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="other-operations"
                elevation={0}
                getContentAnchorEl={null}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleClose("slack")}>Slackに招待</MenuItem>
                <MenuItem onClick={handleClose("export")}>CSVエクスポート</MenuItem>
                <MenuItem onClick={handleClose("remind_payment")}>会費未払い通知メール</MenuItem>
              </Menu>
            </Box>
          </>
        )}
    </Toolbar>
  );
};

const NoTopBottomPaddingCheckbox = withStyles({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
})(Checkbox);

export const EnhancedTable: React.FC<{
  rows: Array<Data>;
  defaultSortedBy: keyof Data;
  headCells: Array<HeadCell>;
  handleEditPaymnetStatus?: (id: number, status: boolean) => Promise<Data>;
  handleClickMenu: handleClickMenuType;
}> = ({
  rows: rowsBase,
  defaultSortedBy,
  headCells,
  handleEditPaymnetStatus,
  handleClickMenu,
}) => {
    const [rows, setRows] = React.useState<Array<Data>>(rowsBase);
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>(defaultSortedBy);
    const [selected, setSelected] = React.useState<number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [editPaymentStatusMode, setEditPaymentStatusMode] = React.useState(
      false
    );

    const handleRequestSort = (
      event: React.MouseEvent<unknown>,
      property: keyof Data
    ) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (editPaymentStatusMode) {
        return;
      }

      if (event.target.checked) {
        const newSelecteds = rows.map((n) => n.id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
      if (editPaymentStatusMode) {
        return;
      }

      const selectedIndex = selected.indexOf(id);
      let newSelected: number[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDense(event.target.checked);
    };

    const handleClickOnEditPaymentStatus = (id: number) => {
      const paid = rows.filter((x) => x.id === id).map((x) => x.paid)[0];
      setRows(
        rows.map((x) =>
          x.id !== id
            ? x
            : { ...x, paid: x.paid === "YES" ? "NO(WIP)" : "YES(WIP)" }
        )
      );

      if (handleEditPaymnetStatus) {
        handleEditPaymnetStatus(id, paid !== "YES")
          .then((data) => {
            setRows(rows.map((x) => (x.id !== id ? x : data)));
          })
          .catch((err) => console.error(err));
      }
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            editMode={editPaymentStatusMode}
            handleClickOnEditMode={() => {
              setSelected([]), setEditPaymentStatusMode(!editPaymentStatusMode);
            }}
            handleClickMenu={handleClickMenu}
          />

          <TableContainer className={classes.tableWrapper}>
            <Table
              stickyHeader
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                disabledCheckbox={editPaymentStatusMode}
                order={order}
                orderBy={orderBy}
                headCells={headCells}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                            disabled={editPaymentStatusMode}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.id}
                        </TableCell>
                        {headCells
                          .filter(({ id }) => id !== "id")
                          .map(({ id: propertyName }) =>
                            propertyName == "paid" && editPaymentStatusMode ? (
                              <TableCell padding="none" key={propertyName}>
                                <NoTopBottomPaddingCheckbox
                                  checked={row[propertyName].startsWith("YES")}
                                  disabled={row[propertyName].includes("(WIP)")}
                                  onClick={() =>
                                    handleClickOnEditPaymentStatus(row.id)
                                  }
                                />
                              </TableCell>
                            ) : (
                                <TableCell align="left" key={propertyName}>
                                  {row[propertyName]}
                                </TableCell>
                              )
                          )}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </div>
    );
  };

export default EnhancedTable;
