import { AppSidebar } from "./app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router";
import { useFetchUser } from "@/hooks/useAuth";
import Loading from "@/components/common/FullLoading";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigate } from "@/utils/navigate";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isLoading } = useFetchUser(); // Ensure user data is fetched before checking auth state

  if (isLoading)
    return (
      <div className="h-screen">
        <Loading />
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider className="relative overflow-x-hidden">
      <AppSidebar />
      <SidebarInset>
        <div className="flex w-full max-w-full flex-1 flex-col gap-4 overflow-x-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
