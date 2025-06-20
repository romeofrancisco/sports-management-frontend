import { useRoutes } from "react-router-dom";
import { USER_ROLES } from "@/constants/roles";
import { adminRoutes } from "./AdminRoutes";
import { coachRoutes } from "./CoachRoutes";
import { playerRoutes } from "./PlayerRoutes";
import PageNotFound from "@/pages/PageNotFound";
import { useSelector } from "react-redux";

const routeMap = {
  [USER_ROLES.ADMIN]: adminRoutes,
  [USER_ROLES.COACH]: coachRoutes,
  [USER_ROLES.PLAYER]: playerRoutes,
};

export const RoleRoutes = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const routes = [
    ...(routeMap[role] ?? []),
    { path: "*", element: <PageNotFound /> },
  ];

  return useRoutes(routes);
};
