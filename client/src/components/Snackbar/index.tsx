import { Snackbar } from "@mui/material";
import React from "react";

export interface SnackBarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: "notify" | "progress";
  message: string;
}

const SnackBar = ({ open, setOpen, type, message }: SnackBarProps) => {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway" && type === "progress") {
      return;
    }

    setOpen(false);
  };
  return type === "notify" ? (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      message={message}
    />
  ) : (
    <Snackbar open={open} onClose={handleClose} message={message} />
  );
};

export default SnackBar;
