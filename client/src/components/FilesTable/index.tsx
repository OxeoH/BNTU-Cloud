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
import { Avatar, IconButton, Stack, Tooltip } from "@mui/material";
import { getFileIcon } from "../../shared/getFileIcon";
import EnhancedTableHead, { Order } from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import {
  removeFiles,
  setCurrentDir,
  setFiles,
} from "../../store/slices/fileSlice";
import { deleteFile, downloadFile, getFiles } from "../../api/File";
import { User } from "../../api/User/types";
import { convertFromBytes } from "../../shared/convertFromBytes";
import {
  Delete,
  Download,
  FormatListBulleted,
  LockOpen,
} from "@mui/icons-material";
import { getAvatar } from "../../shared/getAvatar";
import { setUser } from "../../store/slices/userSlice";
import SkeletonLoader from "../SkeletonLoader";

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
  const [loader, setLoader] = React.useState(false);

  const dispatch = useAppDispatch();
  const currentDir = useAppSelector((state) => state.file.currentDir);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const rows = useAppSelector((state) => state.file.files);
  const rootDir = useAppSelector((state) => state.file.rootDir);
  const { fileFilter, fileFilterApplied } = useAppSelector(
    (state) => state.filter
  );

  React.useEffect(() => {
    dispatch(setCurrentDir(rootDir ?? currentUser.files[0]));
  }, []);

  React.useEffect(() => {
    async function getCurrentFiles() {
      try {
        setLoader(true);
        const filtered = (
          await getFiles(currentDir?.id ?? currentUser.files[0].id)
        )
          .filter((file) => {
            if (!fileFilterApplied) return true;
            if (fileFilter.filetype != null) {
              return file.type === fileFilter.filetype;
            }
            return true;
          })
          .filter((file) => {
            if (!fileFilterApplied) return true;
            if (fileFilter.user != null) {
              return (
                file.user.login === fileFilter.user.login &&
                file.user.email === fileFilter.user.email &&
                file.user.id === fileFilter.user.id
              );
            }
            return true;
          })
          .filter((file) => {
            if (!fileFilterApplied) return true;
            if (fileFilter.name != null) {
              return file.name
                .toLocaleLowerCase()
                .includes(fileFilter.name.toLocaleLowerCase());
            }
            return true;
          });

        dispatch(setFiles(filtered));
      } catch (e: any) {
        console.log(e);
      } finally {
        setLoader(false);
      }
    }
    if (currentUser) getCurrentFiles();
  }, [currentDir, fileFilter, fileFilterApplied, currentUser.avatar]);

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
    //setSelected(newSelected);
  };

  const handleDownloadClick = async (e: React.MouseEvent, file: File) => {
    e.stopPropagation();

    try {
      await downloadFile(file);
    } catch (e) {
      console.log(e);
    }
  };
  const handleConfigureAccess = async (e: React.MouseEvent, file: File) => {
    e.stopPropagation();
  };

  const handleDeleteClick = async (e: React.MouseEvent, file: File) => {
    e.stopPropagation();
    try {
      console.log(file);

      const deletedFile = await deleteFile(file.id);
      if (deletedFile.id === file.id) {
        dispatch(
          setUser({
            ...currentUser,
            usedSpace: (
              BigInt(currentUser.usedSpace) - BigInt(deletedFile.size)
            ).toString(),
          })
        );
        dispatch(removeFiles([file.id]));
      }
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
  const renderContent = (isLoading: boolean, files: File[]) => {
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
      if (files.length) {
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
                          {...getAvatar(
                            row.user.surname + " " + row.user.name,
                            row.user.avatar
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
                      <Tooltip title="Настроить доступ" sx={{ mr: 5 }}>
                        <IconButton
                          aria-label="delete"
                          size="large"
                          onClick={(e) => handleConfigureAccess(e, row)}
                        >
                          <LockOpen />
                        </IconButton>
                      </Tooltip>

                      {row.type !== FileType.DIR ? (
                        <Tooltip title="Скачать" sx={{ mr: 5 }}>
                          <IconButton
                            aria-label="download"
                            size="large"
                            onClick={(e) => handleDownloadClick(e, row)}
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <TableBody></TableBody>
                      )}
                      <Tooltip title="Удалить" sx={{ mr: 5 }}>
                        <IconButton
                          aria-label="delete"
                          size="large"
                          onClick={(e) => handleDeleteClick(e, row)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
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
            Здесь могли быть ваши файлы
          </Typography>
          <Typography
            variant="subtitle1"
            color={(theme) => theme.palette.primary.main}
            sx={{ my: 10 }}
          >
            Создайте или загрузите несколько, чтобы начать пользоваться таблицей
          </Typography>
          <FormatListBulleted
            fontSize="large"
            color="primary"
            sx={{ my: 10 }}
          />
        </Stack>
      );
    }
  };

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
