import AdminDashboard from "@/pages/admin/dashboard/AdminDashboard";
import SportsList from "@/pages/admin/sport/SportsList";
import SportDetails from "@/pages/admin/sport/SportDetails";
import TeamsList from "@/pages/admin/team/TeamsList";
import TeamDetails from "@/pages/admin/team/TeamDetails";
import GameSchedule from "@/pages/admin/game/GameSchedule";
import PlayersList from "@/pages/admin/player/PlayersList";
import PlayerDetails from "@/pages/admin/player/PlayerDetails";
import GameScoring from "@/pages/admin/game/GameScoring";
import LeaguesList from "@/pages/admin/league/LeaguesList";
import CoachList from "@/pages/admin/coach/CoachList";
import CoachDetails from "@/pages/admin/coach/CoachDetails";
import LeagueDetails from "@/pages/admin/league/LeagueDetails";
import TournamentsList from "@/pages/admin/tournament/TournamentsList";
import SeasonDetails from "@/pages/admin/league/season/SeasonDetails";
import GameResult from "@/pages/admin/game/GameResult";
import TrainingDashboard from "@/components/trainings/dashboard/TrainingDashboard";
import TrainingSessionsPage from "@/pages/trainings/TrainingSessionsPage";
import PlayerProgressPage from "@/pages/trainings/PlayerProgressPage";
import PlayerProgressIndividualPage from "@/pages/trainings/PlayerProgressIndividualPage";
import PlayerProgressTeamPage from "@/pages/trainings/PlayerProgressTeamPage";
import PlayerProgressIndividualSelectionPage from "@/pages/trainings/PlayerProgressIndividualSelectionPage";
import PlayerProgressTeamSelectionPage from "@/pages/trainings/PlayerProgressTeamSelectionPage";
import AttendanceAnalyticsPage from "@/pages/trainings/AttendanceAnalyticsPage";
import TrainingCategoriesPage from "@/pages/trainings/TrainingCategoriesPage";
import TrainingMetricsPage from "@/pages/trainings/TrainingMetricsPage";
import TrainingUnitsPage from "@/pages/trainings/TrainingUnitsPage";
import SystemSettingsPage from "@/pages/admin/settings/SystemSettingsPage";

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
    path: "/coaches",
    element: <CoachList />,
  },
  {
    path: "/coaches/:coach",
    element: <CoachDetails />,
  },
  {
    path: "/leagues",
    element: <LeaguesList />,
  },
  {
    path: "/leagues/:league",
    element: <LeagueDetails />,
  },
  {
    path: "/leagues/:league/season/:season",
    element: <SeasonDetails />,
  },
  {
    path: "/tournaments",
    element: <TournamentsList />,
  },
  {
    path: "/games",
    element: <GameSchedule />,
  },
  {
    path: "/games/:gameId",
    element: <GameScoring />,
  },
  {
    path: "/games/:gameId/game-result",
    element: <GameResult />,
  },  {
    path: "/trainings",
    element: <TrainingDashboard />,
  },
  {
    path: "/trainings/sessions",
    element: <TrainingSessionsPage />,
  },  {
    path: "/trainings/progress",
    element: <PlayerProgressPage />,
  },
  {
    path: "/trainings/progress/individual",
    element: <PlayerProgressIndividualSelectionPage />,
  },
  {
    path: "/trainings/progress/teams",
    element: <PlayerProgressTeamSelectionPage />,
  },
  {
    path: "/trainings/progress/player/:playerId",
    element: <PlayerProgressIndividualPage />,
  },
  {
    path: "/trainings/progress/team/:teamSlug",
    element: <PlayerProgressTeamPage />,
  },
  {
    path: "/trainings/attendance",
    element: <AttendanceAnalyticsPage />,
  },
  {
    path: "/trainings/categories",
    element: <TrainingCategoriesPage />,
  },
  {
    path: "/trainings/metrics",
    element: <TrainingMetricsPage />,
  },
  {
    path: "/trainings/units",
    element: <TrainingUnitsPage />,
  },
  {
    path: "/settings",
    element: <SystemSettingsPage />,
  },
];
