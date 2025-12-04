import PlayerDashboard from "@/pages/player/PlayerDashboard";
import TrainingPage from "@/pages/player/TrainingPage";
import GameSchedule from "@/pages/admin/game/GameSchedule";
import GameResult from "@/pages/admin/game/GameResult";
import LeaguesList from "@/pages/admin/league/LeaguesList";
import LeagueDetails from "@/pages/admin/league/LeagueDetails";
import SeasonDetails from "@/pages/admin/league/season/SeasonDetails";
import TeamDetails from "@/pages/admin/team/TeamDetails";
import { ChatPage } from "@/pages/chat";
import DocumentsList from "@/pages/documents/DocumentsList";
import DocumentEditor from "@/features/editors/document/DocumentEditor";
import TournamentsList from "@/pages/admin/tournament/TournamentsList";
import TournamentDetails from "@/pages/admin/tournament/TournamentDetails";
import EventCalendar from "@/features/eventcalendar/EventCalendar";
import IdentifyEditor from "@/pages/documents/IdentifyEditor";

export const playerRoutes = [
  {
    path: "/dashboard",
    element: <PlayerDashboard />,
  },
  {
    path: "/games",
    element: <GameSchedule />,
  },
  {
    path: "/games/:gameId",
    element: <GameSchedule />,
  },
  {
    path: "/games/:gameId/game-result",
    element: <GameResult />,
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
    path: "/leagues/:league/seasons/:season/games/:gameId",
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
  {
    path: "/tournaments",
    element: <TournamentsList />,
  },
  {
    path: "/tournaments/:tournamentId",
    element: <TournamentDetails />,
  },
  {
    path: "/tournaments/:tournamentId/standings",
    element: <TournamentDetails />,
  },
  {
    path: "/tournaments/:tournamentId/teams",
    element: <TournamentDetails />,
  },
  {
    path: "/tournaments/:tournamentId/games",
    element: <TournamentDetails />,
  },
    {
    path: "/tournaments/:tournamentId/games/:gameId",
    element: <TournamentDetails />,
  },
  {
    path: "/tournaments/:tournamentId/bracket",
    element: <TournamentDetails />,
  },
  {
    path: "/chat/team/:teamId",
    element: <ChatPage />,
  },
  {
    path: "/documents",
    element: <DocumentsList />,
  },
  {
    path: "documents/editor",
    element: <IdentifyEditor />,
  },
  {
    path: "documents/editor/:documentId",
    element: <IdentifyEditor />,
  },
  {
    path: "calendar",
    element: <EventCalendar />,
  },
];
