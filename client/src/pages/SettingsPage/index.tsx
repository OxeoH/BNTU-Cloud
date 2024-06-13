import { Container, CssBaseline, Stack, Typography } from "@mui/material";
import EditUserForm from "../../components/EditUserForm";
import { useAppSelector } from "../../shared/hooks";

export default function SettingsPage() {
  const { currentUser } = useAppSelector((state) => state.user);

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
        <EditUserForm currentContact={currentUser} adminPreset={false} />
      </Stack>
    </Container>
  );
}
