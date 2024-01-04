import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../../routes/utils/consts";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ paddingX: 20 }}>
        <Toolbar>
          <Sidebar />
          <Button color="inherit" onClick={() => navigate(LOGIN_ROUTE)}>
            Войти
          </Button>
          <Button color="inherit" onClick={() => navigate(REGISTER_ROUTE)}>
            Регистрация
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
