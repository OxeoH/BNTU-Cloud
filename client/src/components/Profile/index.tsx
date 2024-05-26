import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../../routes/utils/consts";
import {
  Avatar,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { logout, setAvatar } from "../../store/slices/userSlice";
import { clearFiles } from "../../store/slices/fileSlice";
import { getAvatar } from "../../shared/getAvatar";
import { uploadAvatar } from "../../api/File";
import { AccountCircle, ExitToApp } from "@mui/icons-material";

export default function Profile() {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const { isAuth, currentUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleExit = () => {
    handleClose();
    localStorage.setItem("token", "");
    dispatch(clearFiles());
    dispatch(logout());
    navigate(LOGIN_ROUTE);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //e.stopPropagation();
    try {
      const avatarFile = e.target.files ? e.target.files[0] : null;

      if (avatarFile) {
        const { avatar } = await uploadAvatar(avatarFile);
        dispatch(setAvatar(avatar ?? ""));
      }
    } catch (e) {
      console.log(e);
    }
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
            sx={{ cursor: "pointer" }}
          >
            <Tooltip title={currentUser.login}>
              <Typography variant="h5" sx={{ mr: 10 }}>
                {currentUser.login.length > 12
                  ? currentUser.login.slice(0, 12) + "..."
                  : currentUser.login}
              </Typography>
            </Tooltip>
            <Avatar
              {...getAvatar(
                currentUser.surname + " " + currentUser.name,
                currentUser.avatar
              )}
              sx={{
                bgcolor: "white",
                color: (theme) => theme.palette.primary.main,

                width: 44,
                height: 44,
              }}
            />
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
            <Button
              component="label"
              variant="contained"
              sx={{
                width: "100%",
                borderRadius: 0,
                justifyContent: "flex-start",
                color: (theme) => theme.palette.text.primary,
              }}
              tabIndex={-1}
              color="secondary"
              startIcon={<AccountCircle color="primary" />}
            >
              <Typography variant="h4" textAlign="center">
                Сменить аватар
              </Typography>
              <VisuallyHiddenInput
                type="file"
                accept=".jpg,.jpeg"
                onChange={(e) => handleAvatarChange(e)}
              />
            </Button>
            <Divider />
            <Button
              component="label"
              variant="contained"
              sx={{
                width: "100%",
                borderRadius: 0,
                justifyContent: "flex-start",
                color: (theme) => theme.palette.text.primary,
              }}
              tabIndex={-1}
              color="secondary"
              startIcon={<ExitToApp color="error" />}
              onClick={handleExit}
            >
              <Typography variant="h4" textAlign="center">
                Выйти
              </Typography>
            </Button>
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
