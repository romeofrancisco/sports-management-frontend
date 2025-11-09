import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import { RoleRoutes } from "./RoleRoutes";
import PageNotFound from "@/pages/PageNotFound";
import NavbarProvider from "@/layout/navbar-provider";
import SetPassword from "@/pages/auth/SetPassword";

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
