import { Button, Stack, Typography } from "@mui/material";
import { ProgressBar } from "../../widgets/ProgressBar";
import FilesTable from "../../components/FilesTable";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { KeyboardBackspace } from "@mui/icons-material";
import { useAppSelector } from "../../shared/hooks";

export default function StoragePage() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentDir = useAppSelector((state) => state.file.currentDir);
  const isRoot = currentUser.files[0].id === currentDir;
  return (
    <Stack direction="column" width="100%">
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
            size={currentUser.diskSpace / 1024 ** 3}
            value={currentUser.usedSpace / 1024 ** 3}
          />
        </Stack>
        <Typography
          variant="subtitle1"
          component="h4"
          textAlign="center"
          mt={6}
        >
          Использовано {currentUser.usedSpace / 1024 ** 3}ГБ из{" "}
          {currentUser.diskSpace / 1024 ** 3}ГБ
        </Typography>
      </Stack>
      {/* DIR */}
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
            startIcon={<CreateNewFolderIcon />}
            sx={{ borderRadius: 20, px: 20 }}
            color="secondary"
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
