import AdminDashboard from "@/pages/admin/AdminDashboard";
import SportsList from "@/pages/admin/SportsList";
import Sport from "@/pages/admin/SportDetails";
import TeamsList from "@/pages/admin/TeamsList";
import Team from "@/pages/admin/TeamDetails";
import GameSchedule from "@/pages/admin/GameSchedule";
import path from "path";

export const adminRoutes = [
  {
    path: "/",
    element: <AdminDashboard />,
  },
  {
    path: "/sports",
    element: <SportsList />,
  },
  {
    path: "/sports/:sport",
    element: <Sport />,
  },
  {
    path: "/teams",
    element: <TeamsList />,
  },
  {
    path: "/teams/:team",
    element: <Team />,
  },
  {
    path: "game-schedules",
    element: <GameSchedule />,
  },
];
