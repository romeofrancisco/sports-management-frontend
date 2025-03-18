import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/features/auth/LoginPage";
import { RoleRoutes } from "./RoleRoutes";
import PageNotFound from "@/pages/PageNotFound";
import Layout from "@/features/sidebar/sidebar-provider";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <Layout />,
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
