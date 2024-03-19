import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../../routes/utils/consts";
import {
  Avatar,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { logout } from "../../store/slices/userSlice";

export default function Profile() {
  const { isAuth, currentUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  function stringAvatar(name: string) {
    return {
      //   sx: {
      //     bgcolor: stringToColor(name),
      //   },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleExit = () => {
    handleClose();
    dispatch(logout());
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack direction="row" alignItems="center">
      {isAuth ? (
        <>
          <Stack
            direction="row"
            alignItems="center"
            id="profile-button"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <Avatar
              {...stringAvatar(currentUser.surname + " " + currentUser.name)}
              sx={{
                bgcolor: "white",
                color: (theme) => theme.palette.primary.main,
                mr: 10,
                width: 44,
                height: 44,
              }}
            />
            <Typography variant="subtitle1"></Typography>
          </Stack>

          <Menu
            id="demo-positioned-menu"
            aria-labelledby="profile-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Typography
              align="left"
              variant="subtitle1"
              color="primary.light"
              width={200}
              pr={20}
              pl={15}
              py={10}
            >
              {currentUser.surname + " " + currentUser.name}
            </Typography>
            <Divider />
            <MenuItem onClick={handleExit}>Выйти</MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Button color="inherit" onClick={() => navigate(LOGIN_ROUTE)}>
            Войти
          </Button>
          <Button color="inherit" onClick={() => navigate(REGISTER_ROUTE)}>
            Регистрация
          </Button>
        </>
      )}
    </Stack>
  );
}
