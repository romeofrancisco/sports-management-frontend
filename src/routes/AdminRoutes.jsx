import AdminDashboard from "@/pages/admin/AdminDashboard";
import Sports from "@/pages/admin/Sports";
import Teams from "@/pages/admin/Teams";

export const adminRoutes = [
  {
    path: "/",
    element: <AdminDashboard />,
  },
  {
    path: "/sports",
    element: <Sports />,
  },
  {
    path: "/teams",
    element: <Teams />,
  },
];
