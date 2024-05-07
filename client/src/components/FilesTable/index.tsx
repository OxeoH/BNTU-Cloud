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
import { File, FileType } from "../../api/File/types";
import { Avatar, IconButton, Stack } from "@mui/material";
import { getFileIcon } from "../../shared/getFileIcon";
import EnhancedTableHead, { Order } from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { setCurrentDir, setFiles } from "../../store/slices/fileSlice";
import { downloadFile, getFiles } from "../../api/File";
import { User } from "../../api/User/types";
import { convertFromBytes } from "../../shared/convertFromBytes";
import { Delete, Download } from "@mui/icons-material";
import { avatarToString } from "../../shared/avatarToString";

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
    [key in Key]:
      | number
      | string
      | boolean
      | FileType
      | User
      | File
      | bigint
      | Date;
  },
  b: {
    [key in Key]:
      | number
      | string
      | boolean
      | FileType
      | User
      | File
      | bigint
      | Date;
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
  const [orderBy, setOrderBy] = React.useState<keyof File>("size");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const dispatch = useAppDispatch();
  const currentDir = useAppSelector((state) => state.file.currentDir);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const rows = useAppSelector((state) => state.file.files);
  const rootDir = useAppSelector((state) => state.file.rootDir);

  React.useEffect(() => {
    dispatch(setCurrentDir(rootDir ?? currentUser.files[0]));
  }, []);

  React.useEffect(() => {
    async function getCurrentFiles() {
      try {
        dispatch(
          setFiles(await getFiles(currentDir?.id ?? currentUser.files[0].id))
        );
      } catch (e: any) {
        console.log(e);
      }
    }
    if (currentUser) getCurrentFiles();
  }, [currentDir]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof File
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  const handleDownloadClick = async (e: React.MouseEvent, file: File) => {
    e.stopPropagation();

    try {
      await downloadFile(file);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();

    try {
    } catch (e) {
      console.log(e);
    }
  };

  const handleDoubleClick = (event: React.MouseEvent, row: File) => {
    if (row.type === FileType.DIR) {
      dispatch(setCurrentDir(row));
    }
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

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", overflow: "hidden", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          currentDir={currentDir ?? currentUser.files[0]}
        />
        <TableContainer sx={{ maxHeight: "50vh" }}>
          <Table
            sx={{ minWidth: 750, p: 2 }}
            stickyHeader
            aria-label="sticky table"
            size="medium"
          >
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
                        {getFileIcon(row.type)}
                        <Typography
                          variant="subtitle1"
                          component="h4"
                          sx={{ ml: 10 }}
                        >
                          {row.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" component="h4">
                        {`.${row.type}`}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" component="h4">
                        {row.uploaded.toString().slice(0, 10)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" component="h4">
                        {convertFromBytes(BigInt(row.size))}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="right"
                        alignItems="center"
                      >
                        <Typography variant="caption" sx={{ mr: 10 }}>
                          {row.user.email}
                        </Typography>
                        <Avatar
                          {...avatarToString(
                            row.user.surname + " " + row.user.name
                          )}
                          sx={{
                            bgcolor: (theme) => theme.palette.primary.light,
                            color: (theme) => theme.palette.secondary.main,
                            width: 36,
                            height: 36,
                          }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      {row.type !== FileType.DIR ? (
                        <IconButton
                          aria-label="download"
                          size="large"
                          onClick={(e) => handleDownloadClick(e, row)}
                        >
                          <Download />
                        </IconButton>
                      ) : (
                        <></>
                      )}

                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={(e) => handleDeleteClick(e, row.id)}
                      >
                        <Delete />
                      </IconButton>
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
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
