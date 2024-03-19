import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { MAIN_ROUTE, REGISTER_ROUTE } from "../../routes/utils/consts";
import Copyright from "../../components/Copyright";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import { authorization } from "../../api/User";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const authData = {
        login: `${data.get("login")}`,
        password: `${data.get("password")}`,
      };

      const response = await authorization(authData);

      dispatch(setUser(response.user));
      navigate(MAIN_ROUTE);
    } catch (e: any) {
      //TODO: Error type
      alert(e.message);
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
            Авторизация
          </Typography>
        </Box>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={12} mb={12}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="login"
                label="Логин"
                name="login"
                autoFocus
                autoComplete="nickname"
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
            Войти
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate(REGISTER_ROUTE)}
              >
                Нет аккаунта? Регистрация
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
