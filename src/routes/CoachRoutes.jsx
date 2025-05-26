import CoachDashboard from "@/pages/coach/CoachDashboard";
import TeamsList from "@/pages/admin/team/TeamsList";
import TeamDetails from "@/pages/admin/team/TeamDetails";
import PlayersList from "@/pages/admin/player/PlayersList";
import GameSchedule from "@/pages/admin/game/GameSchedule";
import PlayerDetails from "@/pages/admin/player/PlayerDetails";
import TrainingDashboard from "@/components/trainings/dashboard/TrainingDashboard";

export const coachRoutes = [
  {
    path: "/",
    element: <CoachDashboard />,
  },
  {
    path: "/teams",
    element: <TeamsList />,
  },
  {
    path: "/teams/:id",
    element: <TeamDetails />,
  },
  {
    path: "/players",
    element: <PlayersList />,
  },
    {
    path: "/players/:id",
    element: <PlayerDetails />,
  },  {
    path: "/games",
    element: <GameSchedule />,
  }, 
  {
    path: "/trainings",
    element: <TrainingDashboard />,
  },
];
