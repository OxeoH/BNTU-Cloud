import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { LOGIN_ROUTE } from "../../routes/utils/consts";
import Copyright from "../../components/Copyright";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { groupsList } from "../../shared/groupsList";
import { useState } from "react";
import { Logo } from "../../components/Logo";
import { registration } from "../../api/User";
import { UserRole } from "../../api/User/types";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedRole, setSelectedRole] = useState(UserRole.STUDENT);
  const navigate = useNavigate();

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(e.target.checked ? UserRole.TEACHER : UserRole.STUDENT);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const newUser = {
        surname: `${data.get("surname")}`,
        name: `${data.get("name")}`,
        patronymic: `${data.get("patronymic")}`,
        login: `${data.get("login")}`,
        group:
          selectedRole === UserRole.TEACHER
            ? "teacher"
            : `${data.get("group")}`,
        email: `${data.get("email")}`,
        password: `${data.get("password")}`,
        role: selectedRole,
      };

      await registration(newUser);

      navigate(LOGIN_ROUTE);
    } catch (e: any) {
      //TODO: Error type
      alert(
        e.response.data.message + "\n" + JSON.stringify(e.response.data.errors)
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginBottom: 12,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Logo size={20} />

          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
        </Box>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  autoFocus
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Grid container justifyContent={"center"} mb={12}>
              <FormControlLabel
                control={<Switch onChange={handleRoleChange} />}
                label="Преподаватель"
                id="role"
                name="role"
              />
            </Grid>
            {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Создать аккаунт
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate(LOGIN_ROUTE)}
              >
                Уже есть аккаунт? Войти
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
