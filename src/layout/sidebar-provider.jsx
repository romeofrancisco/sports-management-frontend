import { AppSidebar } from "./app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useFetchUser } from "@/hooks/useAuth";
import Loading from "@/components/common/Loading";
import BreadCrumb from "./bread-crumb";

export default function Layout() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading } = useFetchUser(); // Ensure user data is fetched before checking auth state

  if (isLoading)
    return (
      <div className="h-screen">
        <Loading />
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider className="relative">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between pe-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadCrumb />
          </div>
          <ThemeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-3 lg-p-5 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
