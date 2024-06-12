import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { UserRole } from "../../api/User/types";
import { groupsList } from "../../shared/groupsList";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { getAvatar } from "../../shared/getAvatar";
import { setAvatar } from "../../store/slices/userSlice";
import { uploadAvatar } from "../../api/File";

export default function SettingsPage() {
  const { currentUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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

  const [selectedGroup, setSelectedGroup] = useState(currentUser.group);
  const [selectedRole, setSelectedRole] = useState(currentUser.role);
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(e.target.checked ? UserRole.TEACHER : UserRole.STUDENT);
  };

  const handleSubmit = () => {};

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

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Stack direction="column" alignItems="center" width="100%">
        <Typography
          component="h1"
          variant="h2"
          color="primary"
          my={40}
          textAlign="center"
        >
          Настройки профиля
        </Typography>
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
                currentUser.surname + " " + currentUser.name,
                currentUser.avatar
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
              onSubmit={handleSubmit}
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
                      inputProps={{ defaultValue: currentUser.surname }}
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
                      inputProps={{ defaultValue: currentUser.name }}
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
                      inputProps={{ defaultValue: currentUser.patronymic }}
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
                      inputProps={{ defaultValue: currentUser.login }}
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
                      inputProps={{ defaultValue: currentUser.email }}
                    />
                  </Grid>
                  {currentUser.role !== UserRole.ADMIN ? (
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
              Сменить пароль
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container>
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
            </Box>

            <Button fullWidth variant="outlined" sx={{ mt: 3, mb: 2, px: 30 }}>
              Сохранить новый пароль
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
