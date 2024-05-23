import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Avatar, Badge, IconButton, Stack, Tooltip } from "@mui/material";
import EnhancedTableHead, { Order } from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { User, UserRole } from "../../api/User/types";
import {
  AdminPanelSettings,
  People,
  PersonAdd,
  PersonRemove,
  School,
} from "@mui/icons-material";
import { getAvatar } from "../../shared/getAvatar";
import { setUsers } from "../../store/slices/userSlice";
import SkeletonLoader from "../SkeletonLoader";
import { getAllUsers } from "../../api/User";
import { File } from "../../api/File/types";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: {
    [key in Key]: User | UserRole | string | boolean | File[] | User[];
  },
  b: {
    [key in Key]: User | UserRole | string | boolean | File[] | User[];
  }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof User>("login");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loader, setLoader] = React.useState(false);

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const rows = useAppSelector((state) => state.user.users);
  const { userFilter, userFilterApplied } = useAppSelector(
    (state) => state.filter
  );

  React.useEffect(() => {
    async function getUsersList() {
      try {
        setLoader(true);
        const filteredUsers = (await getAllUsers())!
          .filter((user) => {
            if (!userFilterApplied) return true;
            if (userFilter.name != null) {
              return (user.name + user.surname + user.patronymic).includes(
                userFilter.name
              );
            }
            return true;
          })
          .filter((user) => {
            if (!userFilterApplied) return true;
            if (userFilter.email != null) {
              return user.email === userFilter.email;
            }
            return true;
          })
          .filter((user) => {
            if (!userFilterApplied) return true;
            if (userFilter.group != null) {
              return user.group === userFilter.group;
            }
            return true;
          })
          .filter((user) => {
            if (!userFilterApplied) return true;
            if (userFilter.login != null) {
              return user.login === userFilter.login;
            }
            return true;
          })
          .filter((user) => {
            if (!userFilterApplied) return true;
            if (userFilter.role != null) {
              return user.role === userFilter.role;
            }
            return true;
          });

        dispatch(setUsers(filteredUsers));
      } catch (e: any) {
        console.log(e);
      } finally {
        setLoader(false);
      }
    }
    if (currentUser) getUsersList();
  }, [userFilter, userFilterApplied, currentUser.avatar]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof User
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <AdminPanelSettings />;
      case UserRole.TEACHER:
        return <Badge />;
      case UserRole.STUDENT:
        return <School />;
      default:
        return <School />;
    }
  };

  const handleRemoveContact = (e: React.MouseEvent, contact: User) => {};
  const handleAddContact = (e: React.MouseEvent, contact: User) => {};

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

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

  const handleDoubleClick = (event: React.MouseEvent, row: User) => {};

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rows, rowsPerPage]
  );
  const renderContent = (isLoading: boolean, users: User[]) => {
    if (isLoading)
      return (
        <Stack
          width="100%"
          direction="column"
          justifyContent="center"
          alignItems="center"
          height={400}
          overflow="hidden"
        >
          <SkeletonLoader count={5} />
        </Stack>
      );
    if (!isLoading) {
      if (users.length) {
        return (
          <>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    key={index}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    onClick={(event) => handleClick(event, row.id)}
                    onDoubleClick={(event) => handleDoubleClick(event, row)}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      {/* <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      /> */}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <Stack
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                      >
                        <Avatar
                          {...getAvatar(
                            row.surname + " " + row.name,
                            row.avatar
                          )}
                          sx={{
                            bgcolor: (theme) => theme.palette.primary.light,
                            color: (theme) => theme.palette.secondary.main,
                            width: 36,
                            height: 36,
                            mr: 10,
                          }}
                        />
                        <Stack
                          direction="column"
                          justifyContent="space-between"
                          alignItems="left"
                        >
                          <Typography variant="subtitle1" component="h4">
                            {row.login}
                          </Typography>
                          <Typography variant="subtitle2" component="h4">
                            {row.email}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip
                        title={`${row.surname} ${row.name} ${row.patronymic}`}
                      >
                        <Typography variant="subtitle1" component="h4">
                          {`${row.surname} ${row.name[0]}. ${row.patronymic[0]}.`}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" component="h4">
                        {row.group}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                      >
                        <Typography
                          variant="subtitle1"
                          component="h4"
                          sx={{ mr: 10 }}
                        >
                          {row.role[0].toLocaleUpperCase() + row.role.slice(1)}
                        </Typography>
                        {getRoleIcon(row.role)}
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      {currentUser.contacts.includes(row) ? (
                        <Tooltip title="Добавить в контакты" sx={{ mr: 5 }}>
                          <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={(e) => handleRemoveContact(e, row)}
                          >
                            <PersonRemove />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Добавить в контакты" sx={{ mr: 5 }}>
                          <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={(e) => handleAddContact(e, row)}
                          >
                            <PersonAdd />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </>
        );
      }
      return (
        <Stack
          width="100%"
          direction="column"
          justifyContent="center"
          alignItems="center"
          height={400}
          overflow="hidden"
        >
          <Typography variant="h2" color="InfoText" sx={{ my: 10 }}>
            Тут никого нет...
          </Typography>
          <Typography
            variant="subtitle1"
            color={(theme) => theme.palette.primary.main}
            sx={{ my: 10 }}
          >
            Пригласи одногруппников / коллег, чтобы добавить их в контакты
          </Typography>
          <People fontSize="large" color="primary" sx={{ my: 10 }} />
        </Stack>
      );
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", overflow: "hidden", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer sx={{ maxHeight: "50vh" }}>
          <Table
            sx={{ minWidth: 750, p: 2 }}
            stickyHeader
            aria-label="sticky table"
            size="medium"
          >
            {renderContent(loader, visibleRows)}
          </Table>
        </TableContainer>
        {visibleRows.length ? (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        ) : (
          <></>
        )}
      </Paper>
    </Box>
  );
}
