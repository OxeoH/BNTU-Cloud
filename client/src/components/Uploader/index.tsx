import { Check, Close, Delete, Upload } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { getFileIcon } from "../../shared/getFileIcon";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { clearUploadingFiles } from "../../store/slices/fileSlice";

export interface UploaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Uploader = ({ open, setOpen }: UploaderProps) => {
  const dispatch = useAppDispatch();
  const files = useAppSelector((state) => state.file.uploadingFiles);
  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteClick = () => {
    dispatch(clearUploadingFiles());
  };

  return (
    <div>
      <Drawer
        open={open}
        anchor="right"
        onClose={handleClose}
        disableAutoFocus
        disableEscapeKeyDown
        disableScrollLock
        disableEnforceFocus
        //slotProps={{ backdrop: { style: { display: "none" } } }}
      >
        <Stack direction="column" sx={{ p: 10 }}>
          <Stack
            direction="row"
            sx={{ mb: 2, width: "100%" }}
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton onClick={handleClose} sx={{ mr: 10 }} color="primary">
              <Close />
            </IconButton>
            <Typography
              color="primary"
              variant="h5"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Загрузки
            </Typography>
            {files.length ? (
              <IconButton
                aria-label="delete"
                size="large"
                onClick={() => handleDeleteClick()}
              >
                <Delete />
              </IconButton>
            ) : (
              <></>
            )}
          </Stack>
          <List
            sx={{
              width: "100%",
              minWidth: 420,
              bgcolor: "background.paper",
            }}
          >
            {!files.length ? (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Typography component="h6" color="GrayText" sx={{ my: 6 }}>
                  Список пуст. Начните загружать файлы
                </Typography>
                <Upload color="disabled" fontSize="large" />
              </Stack>
            ) : (
              files.map((file) => (
                <Stack key={file.id}>
                  <ListItem alignItems="center">
                    <ListItemAvatar>{getFileIcon(file.type)}</ListItemAvatar>
                    <ListItemText
                      primary={file.name}
                      secondary={
                        file.progress !== 100
                          ? `${file.progress.toFixed(2)} %`
                          : "Завершено"
                      }
                    />
                    <Box sx={{ pr: 10 }}>
                      {file.progress !== 100 ? (
                        <CircularProgress
                          variant="determinate"
                          value={file.progress}
                        />
                      ) : (
                        <Check color="success" />
                      )}
                    </Box>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </Stack>
              ))
            )}
          </List>
        </Stack>
      </Drawer>
    </div>
  );
};

export default Uploader;
