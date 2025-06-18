import PlayerDashboard from "@/pages/player/PlayerDashboard";
import TrainingPage from "@/pages/player/TrainingPage";

export const playerRoutes = [
  {
    path: "/",
    element: <PlayerDashboard />,
  },
  {
    path: "/trainings",
    element: <TrainingPage />,
  },
  {
    path: "/trainings/assigned",
    element: <TrainingPage />,
  },
  {
    path: "/trainings/sessions",
    element: <TrainingPage />,
  },
  {
    path: "/trainings/progress",
    element: <TrainingPage />,
  },
];
