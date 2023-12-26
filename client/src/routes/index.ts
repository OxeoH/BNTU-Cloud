import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import WelcomePage from "../pages/WelcomePage";

import { LOGIN_ROUTE, MAIN_ROUTE, REGISTER_ROUTE } from "./utils/consts";

// export const authRoutes: RouteType[] = [
//   {
//     path: GROUPS_ROUTE,
//     Component: GroupTable,
//   },
//   {
//     path: GROUPS_ROUTE + "/:id",
//     Component: TaskTable,
//   },
//   {
//     path: ADMIN_PANEL,
//     Component: AdminPanel,
//   },
// ];

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
  // {
  //   path: NOTFOUND_ROUTE,
  //   Component: NotFoundBlock,
  // },
];

export type RouteType = {
  path: string;
  Component: React.FC;
};
