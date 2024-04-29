import { Button, Stack, Typography } from "@mui/material";
import { ProgressBar } from "../../widgets/ProgressBar";
import FilesTable from "../../components/FilesTable";
import { KeyboardBackspace, CreateNewFolder } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { convertFromBytes } from "../../shared/convertFromBytes";
import { useRef, useState } from "react";
import CreateFilePopover from "../../components/CreateFilePopover";
import { setCurrentDir } from "../../store/slices/fileSlice";

export default function StoragePage() {
  const [openCreatePopover, setOpenCreatePopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentDir = useAppSelector((state) => state.file.currentDir);
  const isRoot = currentUser.files[0].id === currentDir?.id;

  return (
    <Stack direction="column" width="100%" ref={anchorRef}>
      <CreateFilePopover
        open={openCreatePopover}
        setOpen={setOpenCreatePopover}
        anchorEl={anchorEl || (anchorRef.current as HTMLDivElement)}
      />
      <Stack
        direction="column"
        width="60%"
        p={12}
        borderRadius={20}
        boxShadow={3}
        justifyContent="center"
        alignSelf="center"
        my={20}
      >
        <Stack width="96%" alignSelf="center">
          <ProgressBar
            size={convertFromBytes(currentUser.diskSpace)}
            value={convertFromBytes(currentUser.usedSpace)}
          />
        </Stack>
        <Typography
          variant="subtitle1"
          component="h4"
          textAlign="center"
          mt={6}
        >
          Использовано {convertFromBytes(currentUser.usedSpace)}ГБ из{" "}
          {convertFromBytes(currentUser.diskSpace)}ГБ
        </Typography>
      </Stack>
      <Stack
        direction="row"
        justifyContent={`${isRoot ? "right" : "space-between"}`}
        alignItems="center"
        mb={20}
      >
        <Button
          variant="contained"
          startIcon={<KeyboardBackspace />}
          sx={{
            borderRadius: 20,
            px: 20,
            display: `${isRoot ? "none" : ""}`,
          }}
          color="secondary"
          onClick={() =>
            dispatch(setCurrentDir(currentDir?.parent ?? currentUser.files[0]))
          }
        >
          <Typography variant="h4" textAlign="center">
            Назад
          </Typography>
        </Button>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          maxWidth="40%"
        >
          <Button
            variant="contained"
            startIcon={<CreateNewFolder />}
            sx={{ borderRadius: 20, px: 20 }}
            color="secondary"
            onClick={() => setOpenCreatePopover(!openCreatePopover)}
          >
            <Typography variant="h4" textAlign="center">
              Создать файл / папку
            </Typography>
          </Button>
        </Stack>
      </Stack>
      <Stack width="100%" alignItems="center" mb={20}>
        <FilesTable />
      </Stack>
    </Stack>
  );
}
