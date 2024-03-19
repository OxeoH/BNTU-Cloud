import HelpPage from "../pages/HelpPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import SettingsPage from "../pages/SettingsPage";
import StoragePage from "../pages/StoragePage";
import WelcomePage from "../pages/WelcomePage";

import {
  HELP_ROUTE,
  LOGIN_ROUTE,
  MAIN_ROUTE,
  NOTFOUND_ROUTE,
  REGISTER_ROUTE,
  SETTINGS_ROUTE,
  STORAGE_ROUTE,
} from "./utils/consts";

export const authRoutes: RouteType[] = [
  // {
  //   path: GROUPS_ROUTE,
  //   Component: GroupTable,
  // },
  // {
  //   path: GROUPS_ROUTE + "/:id",
  //   Component: TaskTable,
  // },
  // {
  //   path: ADMIN_PANEL,
  //   Component: AdminPanel,
  // },
  {
    path: MAIN_ROUTE,
    Component: WelcomePage,
  },
  {
    path: HELP_ROUTE,
    Component: HelpPage,
  },
  {
    path: STORAGE_ROUTE,
    Component: StoragePage,
  },
  {
    path: SETTINGS_ROUTE,
    Component: SettingsPage,
  },
];

export const defaultRoutes: RouteType[] = [
  {
    path: LOGIN_ROUTE,
    Component: LoginPage,
  },
  {
    path: REGISTER_ROUTE,
    Component: RegisterPage,
  },
  {
    path: MAIN_ROUTE,
    Component: WelcomePage,
  },
  {
    path: HELP_ROUTE,
    Component: HelpPage,
  },
  {
    path: STORAGE_ROUTE,
    Component: StoragePage,
  },
  {
    path: SETTINGS_ROUTE,
    Component: SettingsPage,
  },
  {
    path: NOTFOUND_ROUTE,
    Component: NotFoundPage,
  },
];

export type RouteType = {
  path: string;
  Component: React.FC;
};
