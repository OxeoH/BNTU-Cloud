import { Stack, Typography } from "@mui/material";
import UsersTable from "../../components/UsersTable";

import { useRef } from "react";
import TableFilters from "../../components/TableFilters";
import { setUserFilter } from "../../store/slices/filterSlice";
import { useAppSelector } from "../../shared/hooks";

export default function UsersPage() {
  const anchorRef = useRef<HTMLDivElement>(null);

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentDir = useAppSelector((state) => state.file.currentDir);
  const isRoot = currentUser.files[0].id === currentDir?.id;
  const { userFilter, userFiltersList } = useAppSelector(
    (state) => state.filter
  );

  return (
    <Stack direction="column" width="100%">
      <Stack
        direction="row"
        justifyContent={`${isRoot ? "right" : "space-between"}`}
        alignItems="center"
        mt={10}
      >
        <Typography
          variant="h2"
          color="primary"
          width="100%"
          textAlign="center"
        >
          Контакты
        </Typography>
      </Stack>
      <Stack
        direction="column"
        justifyContent="left"
        alignItems="center"
        sx={{ my: 10 }}
      >
        <Typography variant="h5" color="text" width="100%" textAlign="left">
          Фильтры:
        </Typography>
        <TableFilters
          filters={userFiltersList}
          filter={userFilter}
          setFilter={setUserFilter}
        />
      </Stack>

      <Stack width="100%" alignItems="center" mb={20} ref={anchorRef}>
        <UsersTable />
      </Stack>
    </Stack>
  );
}
