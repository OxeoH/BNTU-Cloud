import {
  Stack,
  Typography,
  Avatar,
  Button,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { User, UserRole } from "../../api/User/types";
import { getAvatar } from "../../shared/getAvatar";
import { groupsList } from "../../shared/groupsList";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { changePassword, changeProfileInfo } from "../../api/User";
import {
  logout,
  setAvatar,
  setUser,
  setUsers,
} from "../../store/slices/userSlice";
import { LOGIN_ROUTE } from "../../routes/utils/consts";
import { uploadAvatar } from "../../api/File";
import {
  changeContactPassword,
  changeContactProfileInfo,
  uploadContactAvatar,
} from "../../api/Admin";

const EditUserForm = ({
  currentContact,
  adminPreset,
}: {
  currentContact: User;
  adminPreset: boolean;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.user.users);

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

  const [selectedGroup, setSelectedGroup] = useState(currentContact.group);
  const [selectedRole, setSelectedRole] = useState(currentContact.role);
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(e.target.checked ? UserRole.TEACHER : UserRole.STUDENT);
  };

  const handleChangeInfoSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const newUserData = {
        surname: `${data.get("surname")}`,
        name: `${data.get("name")}`,
        patronymic: `${data.get("patronymic")}`,
        login: `${data.get("login")}`,
        group: selectedRole === UserRole.TEACHER ? "" : `${data.get("group")}`,
        email: `${data.get("email")}`,
        role: selectedRole,
      };

      if (adminPreset) {
        const updated = await changeContactProfileInfo({
          ...newUserData,
          id: currentContact.id,
        });

        if (updated) {
          dispatch(
            setUsers(users.map((u) => (u = u.id === updated.id ? updated : u)))
          );
        }
      } else {
        const updated = await changeProfileInfo(newUserData);

        if (updated) {
          dispatch(setUser(updated));
        }
      }
    } catch (e: any) {
      //TODO: Error type
      alert(e.message);
    }
  };

  const handleChangePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const newPasswordData = {
        oldPassword: `${data.get("oldPassword")}`,
        newPassword: `${data.get("newPassword")}`,
      };
      if (adminPreset) {
        const newToken = await changeContactPassword({
          id: currentContact.id,
          newPassword: newPasswordData.newPassword,
        });

        // if (!newToken) {
        //   dispatch(logout());
        //   navigate(LOGIN_ROUTE);
        // }
      } else {
        const newToken = await changePassword(newPasswordData);

        if (!newToken) {
          dispatch(logout());
          navigate(LOGIN_ROUTE);
        }
      }
    } catch (e: any) {
      //TODO: Error type
      alert(e.message);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //e.stopPropagation();
    try {
      const avatarFile = e.target.files ? e.target.files[0] : null;

      if (avatarFile) {
        if (adminPreset) {
          const { avatar } = await uploadContactAvatar(
            avatarFile,
            currentContact.id
          );
          dispatch(
            setUsers(
              users.map(
                (u) => (u = u.id === currentContact.id ? { ...u, avatar } : u)
              )
            )
          );
          currentContact.avatar = avatar;
        } else {
          const { avatar } = await uploadAvatar(avatarFile);
          dispatch(setAvatar(avatar ?? ""));
        }
      }
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  };
  return (
    <Stack direction="row" justifyContent="space-between" width="100%">
      <Stack
        direction="column"
        width="100%"
        px={20}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          component="h2"
          variant="h3"
          color="text"
          textAlign="center"
          mb={30}
        >
          Сменить аватар
        </Typography>
        <Avatar
          {...getAvatar(
            currentContact.surname + " " + currentContact.name,
            currentContact.avatar
          )}
          sx={{
            bgcolor: (theme) => theme.palette.primary.light,
            color: (theme) => theme.palette.secondary.main,
            width: 200,
            height: 200,
          }}
        />
        <Button
          component="label"
          variant="outlined"
          tabIndex={-1}
          fullWidth
          color="primary"
          sx={{ mt: 3, mb: 2, px: 30 }}
        >
          Сменить аватар
          <VisuallyHiddenInput
            type="file"
            accept=".jpg,.jpeg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleAvatarChange(e)
            }
          />
        </Button>
      </Stack>

      <Stack
        direction="column"
        width="100%"
        px={20}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          component="h2"
          variant="h3"
          color="text"
          textAlign="center"
          mb={20}
        >
          Общая информация
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleChangeInfoSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container>
            <Grid container spacing={12} mb={12}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="surname"
                  label="Фамилия"
                  name="surname"
                  autoComplete="family-name"
                  inputProps={{ defaultValue: currentContact.surname }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="name"
                  label="Имя"
                  name="name"
                  inputProps={{ defaultValue: currentContact.name }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="patronymic"
                  label="Отчество"
                  name="patronymic"
                  autoComplete="family-name"
                  inputProps={{ defaultValue: currentContact.patronymic }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="group">Группа *</InputLabel>
                  <Select
                    labelId="group"
                    id="group"
                    name="group"
                    disabled={selectedRole === UserRole.TEACHER}
                    value={selectedGroup}
                    required
                    label="Группа *"
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    sx={{ maxHeight: 48 }}
                  >
                    {groupsList.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={12} mb={12}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="login"
                  label="Логин"
                  name="login"
                  autoComplete="login"
                  inputProps={{ defaultValue: currentContact.login }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  inputProps={{ defaultValue: currentContact.email }}
                />
              </Grid>
              {currentContact.role !== UserRole.ADMIN ? (
                <Grid container justifyContent={"center"} mb={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={handleRoleChange}
                        checked={
                          selectedRole === UserRole.TEACHER ? true : false
                        }
                      />
                    }
                    label="Преподаватель"
                    id="role"
                    name="role"
                  />
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            sx={{ mt: 3, mb: 2, px: 30 }}
          >
            Сохранить изменения
          </Button>
        </Box>
      </Stack>

      <Stack
        direction="column"
        width="100%"
        px={20}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Typography
          component="h2"
          variant="h3"
          color="text"
          textAlign="center"
          mb={20}
        >
          Сменить пароль
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleChangePasswordSubmit}
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Grid container>
            {adminPreset ?? (
              <Grid container spacing={0} mb={12}>
                <TextField
                  required
                  fullWidth
                  name="oldPassword"
                  label="Старый пароль"
                  type="password"
                  id="oldPassword"
                  autoComplete="new-password"
                />
              </Grid>
            )}
            <Grid container spacing={0} mb={12}>
              <TextField
                required
                fullWidth
                name="newPassword"
                label="Новый пароль"
                type="password"
                id="newPassword"
                autoComplete="new-password"
              />
            </Grid>
            <Grid container spacing={0} mb={12}>
              <TextField
                required
                fullWidth
                name="repeatPassword"
                label="Повторите пароль"
                type="password"
                id="repeatPassword"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2, px: 30 }}
          >
            Сохранить новый пароль
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default EditUserForm;
