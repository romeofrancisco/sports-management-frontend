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
import SeasonBracket from "@/pages/admin/league/SeasonBracket";
import TournamentsList from "@/pages/admin/tournament/TournamentsList";
import SeasonDetails from "@/pages/admin/league/SeasonDetails";
import GameSummary from "@/pages/admin/game/GameSummary";

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
    path: "/leagues/:league/bracket/:season",
    element: <SeasonBracket />,
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
    path: "/games/:gameId/game-summary",
    element: <GameSummary />,
  },
];
