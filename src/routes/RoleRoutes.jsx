// useRoleRoutes.jsx
import { useRoutes } from "react-router-dom";
import { ADMIN, COACH, PLAYER } from "@/features/auth/constants";
import { adminRoutes } from "./AdminRoutes";
import { coachRoutes } from "./CoachRoutes";
import { playerRoutes } from "./playerRoutes";
import PageNotFound from "@/pages/PageNotFound";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const routeMap = {
  [ADMIN]: adminRoutes,
  [COACH]: coachRoutes,
  [PLAYER]: playerRoutes,
};

const fallbackRoute = { path: "*", element: <PageNotFound /> };

export const RoleRoutes = () => {
  const role = useSelector((state) => state.auth.user?.role);

  const routes = useMemo(
    () => [...(routeMap[role] || []), fallbackRoute],
    [role]
  );

  return useRoutes(routes);
};
