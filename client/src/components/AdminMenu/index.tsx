import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton, Tooltip } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { User } from "../../api/User/types";
import { useState } from "react";
import EditContactModal from "../EditContactModal";

export default function AdminMenu({ contact }: { contact: User }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openEditContact, setOpenEditContact] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditContactClick = () => {
    handleClose();
    setOpenEditContact(true);
  };

  return (
    <div>
      <EditContactModal
        open={openEditContact}
        setOpen={setOpenEditContact}
        contact={contact}
      />
      <Tooltip title="Дополнительно" sx={{ mr: 5 }}>
        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          color="primary"
        >
          <MoreVert />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleEditContactClick}>Изменить профиль</MenuItem>
      </Menu>
    </div>
  );
}
