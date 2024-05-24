import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface AlertDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  agreeHandler: () => Promise<void>;
  setAgreeHandler: React.Dispatch<React.SetStateAction<void>>;
  title?: string;
  text: string;
}

export default function AlertDialog(props: AlertDialogProps) {
  const { open, setOpen, text, title, agreeHandler, setAgreeHandler } = props;

  const handleAgree = async () => {
    await agreeHandler();
    setAgreeHandler(() => {});
    setOpen(false);
  };

  const handleDisagree = () => {
    setAgreeHandler(() => {});
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title ?? "Подтвердите действие"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text ?? "Вы уверены?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree}>Отменить</Button>
        <Button onClick={handleAgree} autoFocus>
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
