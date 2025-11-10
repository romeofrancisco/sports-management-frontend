import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import { RoleRoutes } from "./RoleRoutes";
import PageNotFound from "@/pages/PageNotFound";
import NavbarProvider from "@/layout/navbar-provider";
import SetPassword from "@/pages/auth/SetPassword";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

export const router = createBrowserRouter([
  {
    element: <NavbarProvider />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
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
