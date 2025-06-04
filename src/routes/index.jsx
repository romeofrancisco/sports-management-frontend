import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import { RoleRoutes } from "./RoleRoutes";
import PageNotFound from "@/pages/PageNotFound";
import NavbarProvider from "@/layout/navbar-provider";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <NavbarProvider />,
    children: [
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
