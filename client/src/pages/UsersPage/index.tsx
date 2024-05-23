import { Stack, Typography } from "@mui/material";
import UsersTable from "../../components/UsersTable";

import { useRef } from "react";
import TableFilters from "../../components/TableFilters";
import { setUserFilter } from "../../store/slices/filterSlice";
import { useAppSelector } from "../../shared/hooks";

export default function StoragePage() {
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
      >
        <Typography
          variant="h2"
          color="InfoText"
          width="100%"
          textAlign="center"
        >
          Контакты
        </Typography>
      </Stack>
      <TableFilters
        filters={userFiltersList}
        filter={userFilter}
        setFilter={setUserFilter}
      />
      <Stack width="100%" alignItems="center" mb={20} ref={anchorRef}>
        <UsersTable />
      </Stack>
    </Stack>
  );
}
