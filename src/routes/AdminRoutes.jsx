import AdminDashboard from "@/pages/admin/AdminDashboard";
import SportsList from "@/pages/admin/SportsList";
import SportDetails from "@/pages/admin/SportDetails";
import TeamsList from "@/pages/admin/TeamsList";
import TeamDetails from "@/pages/admin/TeamDetails";
import GameSchedule from "@/pages/admin/GameSchedule";
import PlayersList from "@/pages/admin/PlayersList";
import PlayerDetails from "@/pages/admin/PlayerDetails";
import GameScoring from "@/pages/common/GameScoring";

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
    element: <SportDetails />,
  },
  {
    path: "/teams",
    element: <TeamsList />,
  },
  {
    path: "/teams/:team",
    element: <TeamDetails />,
  },
  {
    path: "/players",
    element: <PlayersList />,
  },
  {
    path: "/players/:player",
    element: <PlayerDetails />,
  },
  {
    path: "/games",
    element: <GameSchedule />,
  },
  {
    path: "/games/:id",
    element: <GameScoring />,
  },
];
