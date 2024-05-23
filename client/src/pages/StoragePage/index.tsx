import { Button, Stack, Typography, styled } from "@mui/material";
import { ProgressBar } from "../../widgets/ProgressBar";
import FilesTable from "../../components/FilesTable";
import {
  KeyboardBackspace,
  CreateNewFolder,
  CloudUpload,
  Download,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { convertFromBytes } from "../../shared/convertFromBytes";
import { ChangeEvent, useRef, useState } from "react";
import CreateFilePopover from "../../components/CreateFilePopover";
import {
  addFiles,
  addUploadingFiles,
  setCurrentDir,
  setUploadingProgress,
} from "../../store/slices/fileSlice";
import { uploadFile } from "../../api/File";
import { setUser } from "../../store/slices/userSlice";
import Uploader from "../../components/Uploader";
import TableFilters from "../../components/TableFilters";
import {
  setFileFilter,
  toggleFileFilterApplied,
} from "../../store/slices/filterSlice";

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

  const [openUploader, setOpenUploader] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentDir = useAppSelector((state) => state.file.currentDir);
  const isRoot = currentUser.files[0].id === currentDir?.id;
  const { fileFilter, filtersList } = useAppSelector((state) => state.filter);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      dispatch(toggleFileFilterApplied(false));
      Array.from(e.target.files ?? []).forEach(async (file) => {
        setOpenUploader(true);
        const choosen = currentDir?.id ? currentDir : currentUser.files[0];

        const uploaded = await uploadFile(
          file,
          choosen,
          dispatch,
          addUploadingFiles,
          setUploadingProgress
        );

        dispatch(addFiles([uploaded]));
        setOpenUploader(false);
        dispatch(
          setUser({
            ...currentUser,
            usedSpace: (
              BigInt(currentUser.usedSpace) + BigInt(uploaded.size)
            ).toString(),
          })
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Stack direction="column" width="100%">
      <Uploader setOpen={setOpenUploader} open={openUploader} />
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
          variant="subtitle2"
          component="h4"
          textAlign="center"
          mt={6}
        >
          Использовано{" "}
          <strong>{convertFromBytes(BigInt(currentUser.usedSpace))}</strong> из{" "}
          <strong>{convertFromBytes(BigInt(currentUser.diskSpace))}</strong>
        </Typography>
      </Stack>

      <Stack
        direction="row"
        justifyContent={`${isRoot ? "right" : "space-between"}`}
        alignItems="center"
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
            variant="contained"
            tabIndex={-1}
            sx={{ borderRadius: 20, px: 20, mr: 12 }}
            color="secondary"
            startIcon={<Download />}
            onClick={() => setOpenUploader(!openUploader)}
          >
            <Typography variant="h4" textAlign="center">
              Загрузки
            </Typography>
          </Button>
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
      <TableFilters
        filters={filtersList}
        filter={fileFilter}
        setFilter={setFileFilter}
      />
      <Stack width="100%" alignItems="center" mb={20} ref={anchorRef}>
        <FilesTable />
      </Stack>
    </Stack>
  );
}
