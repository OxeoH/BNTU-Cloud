import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Sidebar from "../Sidebar";
import Profile from "../Profile";
import { useAppSelector } from "../../shared/hooks";

export default function Navbar() {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ paddingX: 20 }}>
        <Toolbar sx={{ justifyContent: isAuth ? "space-between" : "flex-end" }}>
          {isAuth ? <Sidebar /> : <></>}
          <Profile />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
