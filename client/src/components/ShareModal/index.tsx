import {
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Modal,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { File } from "../../api/File/types";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { getAvatar } from "../../shared/getAvatar";
import { User } from "../../api/User/types";
import { addShare, removeShare } from "../../api/Share";
import { addNewShare, deleteShare } from "../../store/slices/userSlice";

export interface ShareModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  file: File | null;
}

const ShareModal = (props: ShareModalProps) => {
  const { open, setOpen, file } = props;
  const users = useAppSelector((state) => state.user.users);
  const userShares = useAppSelector((state) => state.user.userShares);
  const dispatch = useAppDispatch();

  const [value, setValue] = useState("");
  const [filtered, setFiltered] = useState<User[]>(users);

  const [inputValue, setInputValue] = useState("");

  const getIsChecked = (u: User) => {
    if (!file) return false;
    const currentShare = userShares.find(
      (share) => share.file.id === file.id && share.toUser.id === u.id
    );

    if (currentShare) return true;

    return false;
  };

  const handleShareChange = async (u: User) => {
    if (file) {
      try {
        if (!getIsChecked(u)) {
          const newShare = await addShare(file.id, u.id);

          if (newShare) dispatch(addNewShare(newShare));
        } else {
          const removed = await removeShare(file.id, u.id);
          if (removed) dispatch(deleteShare(removed));
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setInputValue("");
    setValue("");
  };

  const handleChange = (event: any, value: string | null) => {
    setValue(value ?? "");
  };

  const handleInputChange = (event: any, value: string | null) => {
    setInputValue(value ?? "");
  };

  useEffect(() => {
    setFiltered(
      value
        ? users.filter(
            (o) =>
              o.login.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
              o.email.toLocaleLowerCase().includes(value.toLocaleLowerCase())
          )
        : users
    );
  }, [value]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 20,
          width: "30%",
          borderRadius: 2,
        }}
        direction="column"
      >
        <Typography
          variant="h3"
          textAlign="center"
          color="primary"
          sx={{ mb: 10 }}
        >
          Настроить доступ
        </Typography>
        <Autocomplete
          value={value}
          onChange={(event: any, value: string | null) =>
            handleChange(event, value)
          }
          inputValue={inputValue ? inputValue : ""}
          onInputChange={(event, newInputValue) =>
            handleInputChange(event, newInputValue)
          }
          freeSolo
          autoHighlight
          fullWidth
          sx={{ mb: 10 }}
          options={
            value
              ? filtered.map((u) => {
                  return u.email;
                })
              : users.map((u) => {
                  return u.email;
                })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={"Пользователь"}
              InputProps={{
                ...params.InputProps,
                style: {
                  borderRadius: 20,
                  borderColor: "ActiveBorder",
                },
              }}
              InputLabelProps={{
                style: {
                  borderRadius: 20,
                  borderColor: "ActiveBorder",
                },
              }}
            />
          )}
        />
        <List
          dense
          sx={{
            overflow: "auto",
            maxHeight: "30vh",
            minHeight: "30vh",
            width: "100%",
            bgcolor: (theme) => theme.palette.background.paper,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
          }}
        >
          {filtered.map((u, index) => {
            const labelId = `checkbox-list-secondary-label-${value}`;
            return (
              <ListItem
                key={u.id + index}
                secondaryAction={
                  <Switch
                    edge="end"
                    onChange={() => handleShareChange(u)}
                    checked={getIsChecked(u)}
                    inputProps={{
                      "aria-labelledby": "switch-list-label-wifi",
                    }}
                  />
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      {...getAvatar(u.surname + " " + u.name, u.avatar)}
                      sx={{
                        bgcolor: (theme) => theme.palette.primary.light,
                        color: (theme) => theme.palette.secondary.main,
                        width: 36,
                        height: 36,
                        mr: 10,
                      }}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    id={labelId}
                    primary={u.login}
                    secondary={u.email}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Stack>
    </Modal>
  );
};

export default ShareModal;
