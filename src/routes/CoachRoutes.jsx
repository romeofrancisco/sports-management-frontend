import CoachDashboard from "@/pages/coach/CoachDashboard";
import TeamsList from "@/pages/admin/team/TeamsList";
import TeamDetails from "@/pages/admin/team/TeamDetails";
import PlayersList from "@/pages/admin/player/PlayersList";
import GameSchedule from "@/pages/admin/game/GameSchedule";
import GameResult from "@/pages/admin/game/GameResult";
import GameScoring from "@/pages/admin/game/GameScoring";
import PlayerDetails from "@/pages/admin/player/PlayerDetails";
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
import TrainingSummaryPage from "@/pages/trainings/TrainingSummaryPage";
import SessionManagement from "@/components/trainings/sessions/SessionManagement";
import LeaguesList from "@/pages/admin/league/LeaguesList";
import LeagueDetails from "@/pages/admin/league/LeagueDetails";
import SeasonDetails from "@/pages/admin/league/season/SeasonDetails";

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
    path: "/games/:gameId/game-result",
    element: <GameResult />,
  },
  {
    path: "/games/:gameId",
    element: <GameScoring />,
  },
  {
    path: "/trainings",
    element: <TrainingDashboard />,
  },
  {
    path: "/trainings/sessions",
    element: <TrainingSessionsPage />,
  },
  {
    path: "/sessions/:sessionId/manage/*",
    element: <SessionManagement />,
  },
  {
    path: "/trainings/sessions/:sessionId/summary",
    element: <TrainingSummaryPage />,
  },
  {
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
    path: "/leagues",
    element: <LeaguesList />,
  },
  {
    path: "/leagues/:league",
    element: <LeagueDetails />,
  },
  {
    path: "/leagues/:league/leaderboard",
    element: <LeagueDetails />,
  },
  {
    path: "/leagues/:league/teams",
    element: <LeagueDetails />,
  },
  {
    path: "/leagues/:league/seasons",
    element: <LeagueDetails />,
  },
  {
    path: "/leagues/:league/seasons/:season",
    element: <SeasonDetails />,
  },
  {
    path: "/leagues/:league/seasons/:season/standings",
    element: <SeasonDetails />,
  },
  {
    path: "/leagues/:league/seasons/:season/games",
    element: <SeasonDetails />,
  },
  {
    path: "/leagues/:league/seasons/:season/teams",
    element: <SeasonDetails />,
  },
  {
    path: "/leagues/:league/seasons/:season/bracket",
    element: <SeasonDetails />,
  },
];
