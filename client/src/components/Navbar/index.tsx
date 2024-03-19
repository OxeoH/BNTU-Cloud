import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Sidebar from "../Sidebar";
import Profile from "../Profile";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ paddingX: 20 }}>
        <Toolbar>
          <Sidebar />
          <Profile />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
