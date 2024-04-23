import { Button, Stack, Typography } from "@mui/material";
import { ProgressBar } from "../../widgets/ProgressBar";
import FilesTable from "../../components/FilesTable";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { KeyboardBackspace } from "@mui/icons-material";

export default function StoragePage() {
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
          <ProgressBar size={1000} value={100} />
        </Stack>
        <Typography
          variant="subtitle1"
          component="h4"
          textAlign="center"
          mt={6}
        >
          Использовано 2ГБ из 10ГБ
        </Typography>
      </Stack>
      {/* DIR */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={20}
      >
        <Button
          variant="contained"
          startIcon={<KeyboardBackspace />}
          sx={{ borderRadius: 20, px: 20 }}
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
