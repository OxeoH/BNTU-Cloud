import { Modal, Stack, Typography } from "@mui/material";
import React from "react";

import { User } from "../../api/User/types";
import SettingsPage from "../../pages/SettingsPage";
import EditUserForm from "../EditUserForm";

export interface EditContactProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contact: User;
}

const EditContactModal = (props: EditContactProps) => {
  const { open, setOpen, contact } = props;

  const handleClose = () => {
    setOpen(false);
  };

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
          p: 40,
          width: "80%",
          borderRadius: 2,
        }}
        direction="column"
      >
        <Typography
          component="h1"
          variant="h2"
          color="primary"
          mb={40}
          textAlign="center"
        >
          Изменить профиль: {contact.login}
        </Typography>
        <EditUserForm currentContact={contact} adminPreset />
      </Stack>
    </Modal>
  );
};

export default EditContactModal;
