import { Button, Stack, Typography, styled } from "@mui/material";
import { ProgressBar } from "../../widgets/ProgressBar";
import FilesTable from "../../components/FilesTable";
import {
  KeyboardBackspace,
  CreateNewFolder,
  CloudUpload,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { convertFromBytes } from "../../shared/convertFromBytes";
import { ChangeEvent, useRef, useState } from "react";
import CreateFilePopover from "../../components/CreateFilePopover";
import { addFiles, setCurrentDir } from "../../store/slices/fileSlice";
import { uploadFile } from "../../api/File";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function StoragePage() {
  const [openCreatePopover, setOpenCreatePopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentDir = useAppSelector((state) => state.file.currentDir);
  const isRoot = currentUser.files[0].id === currentDir?.id;

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      Array.from(e.target.files ?? []).forEach(async (file) => {
        console.log("File to upload: ", file);
        console.log("Parent dir for file to upload: ", currentDir?.id);
        dispatch(
          addFiles([
            await uploadFile(file, currentDir?.id ?? currentUser.files[0].id),
          ])
        );
      });
    } catch (e) {}
  };

  return (
    <Stack direction="column" width="100%">
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
            size={currentUser.diskSpace.toString()}
            value={currentUser.usedSpace.toString()}
          />
        </Stack>
        <Typography
          variant="subtitle1"
          component="h4"
          textAlign="center"
          mt={6}
        >
          Использовано {convertFromBytes(currentUser.usedSpace)} из{" "}
          {convertFromBytes(currentUser.diskSpace)}
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
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            sx={{ borderRadius: 20, px: 20, mr: 12 }}
            color="secondary"
            startIcon={<CloudUpload />}
          >
            <Typography variant="h4" textAlign="center">
              Загрузить файл
            </Typography>
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => handleUpload(e)}
              multiple
            />
          </Button>
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
      <Stack width="100%" alignItems="center" mb={20} ref={anchorRef}>
        <FilesTable />
      </Stack>
    </Stack>
  );
}
