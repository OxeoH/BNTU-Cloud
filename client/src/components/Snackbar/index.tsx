import { Snackbar } from "@mui/material";
import React from "react";

export enum NotifyType {
  SUCCESS = "success",
  INFO = "info",
  ERROR = "error",
  TEXT = "text",
}

export enum DurationType {
  NOTIFY = "notify",
  PROGRESS = "progress",
}

export interface SnackBarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  duration: "notify" | "progress";
  message: string;
  type: NotifyType;
}

const SnackBar = ({
  open,
  setOpen,
  duration,
  message,
  type,
}: SnackBarProps) => {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway" && duration === "progress") {
      return;
    }

    setOpen(false);
  };
  return duration === "notify" ? (
    <Snackbar
      open={open}
      sx={{
        backgroundColor: (theme) =>
          type !== NotifyType.TEXT
            ? theme.palette[type].main
            : theme.palette[type].secondary,
        color: (theme) => theme.palette.secondary.main,
      }}
      autoHideDuration={5000}
      onClose={handleClose}
      message={message}
    />
  ) : (
    <Snackbar
      sx={{
        backgroundColor: (theme) =>
          type !== NotifyType.TEXT
            ? theme.palette[type].main
            : theme.palette[type].secondary,
        color: (theme) => theme.palette.secondary.main,
      }}
      open={open}
      onClose={handleClose}
      message={message}
    />
  );
};

export default SnackBar;
