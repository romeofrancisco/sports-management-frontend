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
