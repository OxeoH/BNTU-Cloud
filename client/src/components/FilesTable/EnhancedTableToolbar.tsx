import { FolderOpen, Inventory, FilterList, Delete } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { File } from "../../api/File/types";

interface EnhancedTableToolbarProps {
  numSelected: number;
  currentDir: File;
}

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, currentDir } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0
          ? {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }
          : { bgcolor: (theme) => theme.palette.primary.contrastText }),
      }}
    >
      {numSelected > 0 ? (
        <Stack
          sx={{ flex: "1 1 100%", px: 14 }}
          direction="row"
          alignItems="center"
        >
          <Inventory sx={{ mr: 15 }} />
          <Typography color="inherit" variant="h5" component="h5">
            Selected: {numSelected}
          </Typography>
        </Stack>
      ) : (
        <Stack
          sx={{ flex: "1 1 100%", px: 14 }}
          direction="row"
          alignItems="center"
        >
          <FolderOpen sx={{ mr: 15 }} color="primary" />
          <Typography
            variant="h5"
            id="tableTitle"
            component="h5"
            color={(theme) => theme.palette.primary.main}
          >
            {currentDir.root ? "Мой диск" : currentDir.name}
          </Typography>
        </Stack>
      )}
      <Box sx={{ px: 14 }}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <Delete />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterList color="primary" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Toolbar>
  );
}
