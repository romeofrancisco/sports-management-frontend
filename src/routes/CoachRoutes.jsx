import CoachDashboard from "@/pages/coach/CoachDashboard";
import TrainingsPage from "@/pages/admin/training/TrainingsPage";

export const coachRoutes = [
  {
    path: "/",
    element: <CoachDashboard />,
  },
  {
    path: "/trainings",
    element: <TrainingsPage />,
  },
];
