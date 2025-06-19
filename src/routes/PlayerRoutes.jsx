import PlayerDashboard from "@/pages/player/PlayerDashboard";
import TrainingPage from "@/pages/player/TrainingPage";
import GameSchedule from "@/pages/admin/game/GameSchedule";
import GameResult from "@/pages/admin/game/GameResult";
import LeaguesList from "@/pages/admin/league/LeaguesList";
import LeagueDetails from "@/pages/admin/league/LeagueDetails";
import SeasonDetails from "@/pages/admin/league/season/SeasonDetails";
import TeamsList from "@/pages/admin/team/TeamsList";
import TeamDetails from "@/pages/admin/team/TeamDetails";

export const playerRoutes = [
  {
    path: "/",
    element: <PlayerDashboard />,
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
    path: "/teams",
    element: <TeamsList />,
  },
  {
    path: "/teams/:team",
    element: <TeamDetails />,
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
