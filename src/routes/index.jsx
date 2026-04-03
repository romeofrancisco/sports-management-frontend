import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import { RoleRoutes } from "./RoleRoutes";
import PageNotFound from "@/pages/PageNotFound";
import NavbarProvider from "@/layout/navbar-provider";
import SetPassword from "@/pages/auth/SetPassword";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import GoogleCallback from "@/pages/documents/GoogleCallback";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import PlayerRegistrationPage from "@/pages/auth/PlayerRegistrationPage";
import HomePage from "@/pages/home/HomePage";
import Terms from "@/pages/Terms";
import GameSchedule from "@/pages/admin/game/GameSchedule";
import GameResult from "@/pages/admin/game/GameResult";
import LeaguesList from "@/pages/admin/league/LeaguesList";
import LeagueDetails from "@/pages/admin/league/LeagueDetails";
import SeasonDetails from "@/pages/admin/league/season/SeasonDetails";
import TournamentsList from "@/pages/admin/tournament/TournamentsList";
import TournamentDetails from "@/pages/admin/tournament/TournamentDetails";

export const router = createBrowserRouter([
  {
    element: <NavbarProvider />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <PlayerRegistrationPage />,
      },
      {
        path: "/set-password/:uid/:token",
        element: <SetPassword />,
      },
      {
        path: "/reset-password/:uid/:token",
        element: <ResetPassword />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/google-callback",
        element: <GoogleCallback />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/games",
        element: <GameSchedule isPublicView />,
      },
      {
        path: "/games/:gameId",
        element: <GameSchedule isPublicView />,
      },
      {
        path: "/games/:gameId/game-result",
        element: <GameResult />,
      },
      {
        path: "/leagues",
        element: <LeaguesList isPublicView />,
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
        element: <TournamentsList isPublicView />,
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
        path: "/*",
        element: <RoleRoutes />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
