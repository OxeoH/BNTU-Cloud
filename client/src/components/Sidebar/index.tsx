import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import {
  HELP_ROUTE,
  MAIN_ROUTE,
  SETTINGS_ROUTE,
  STORAGE_ROUTE,
} from "../../routes/utils/consts";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [page, setPage] = useState("");

  interface Option {
    text: string;
    route: string;
  }

  const chooseIcon = (option: Option) => {
    switch (option.text) {
      case "Главная":
        return <HomeIcon />;
      case "Мой диск":
        return <StorageIcon />;
      case "Библиотека":
        return <MenuBookIcon />;
      case "Помощь":
        return <HelpIcon />;
      case "Настройки":
        return <SettingsIcon />;
      default:
        return <></>;
    }
  };
  function handleOptionClick(option: Option) {
    setPage(option.text);
    navigate(option.route);
  }

  const getOptions = (options: Option[]) => {
    return (
      <List>
        {options.map((option) => (
          <ListItem key={option.text} disablePadding>
            <ListItemButton
              onClick={() => handleOptionClick(option)}
              selected={page === option.text}
            >
              <ListItemIcon>{chooseIcon(option)}</ListItemIcon>
              <ListItemText primary={option.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 10 }}
        onClick={() => setIsSidebarOpened(true)}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {page}
      </Typography>
      <Drawer
        anchor="left"
        open={isSidebarOpened}
        onClose={() => setIsSidebarOpened(false)}
      >
        <Box
          sx={{
            width: "20rem",
          }}
          role="presentation"
          onClick={() => setIsSidebarOpened(false)}
          onKeyDown={() => setIsSidebarOpened(false)}
        >
          {getOptions([
            { text: "Главная", route: MAIN_ROUTE },
            { text: "Мой диск", route: STORAGE_ROUTE },
          ])}
          <Divider />
          {getOptions([
            { text: "Настройки", route: SETTINGS_ROUTE },
            { text: "Помощь", route: HELP_ROUTE },
          ])}
        </Box>
      </Drawer>
    </>
  );
}
