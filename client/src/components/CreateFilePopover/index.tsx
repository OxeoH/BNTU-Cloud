import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FileType } from "../../api/File/types";
import { useAppSelector } from "../../shared/hooks";
import { createFile } from "../../api/File";
import { useDispatch } from "react-redux";
import { addFiles } from "../../store/slices/fileSlice";

export interface PopoverProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: HTMLDivElement;
}

const CreateFilePopover = (props: PopoverProps) => {
  const [selectedType, setSelectedType] = useState<number>(0);
  const { open, setOpen, anchorEl } = props;
  const options = Object.entries(FileType);
  const currentDir = useAppSelector((state) => state.file.currentDir);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = new FormData(e.currentTarget);
      const createData = {
        name: `${data.get("name")}`,
        type: Object.entries(FileType)[selectedType][1],
        parentId: currentDir?.id ?? currentUser.files[0].id,
      };

      const newFile = await createFile(createData);

      dispatch(addFiles([newFile]));
      setOpen(false);
    } catch (e: any) {
      //TODO: Error type
      alert(e.message);
    }
  };
  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            p: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography component="h1" variant="h5">
              Новый файл
            </Typography>
          </Box>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3, width: "20rem", p: 12, pt: 8 }}
          >
            <Grid container spacing={12} mb={12}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Название файла"
                  name="name"
                  autoFocus
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Тип файла *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={selectedType}
                    label="Тип файла"
                    onChange={(e) => setSelectedType(+e.target.value)}
                  >
                    {options.map((entry, index) => (
                      <MenuItem
                        key={entry[0]}
                        value={index}
                        selected={index === selectedType}
                      >
                        {entry[1]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Создать
            </Button>
          </Box>
        </Box>
      </Container>
    </Popover>
  );
};

export default CreateFilePopover;
