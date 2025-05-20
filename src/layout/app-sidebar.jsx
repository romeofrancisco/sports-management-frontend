import * as React from "react";
import { SidebarNavs } from "./sidebar-navs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { adminNavigation, coachNavigation } from "@/constants/navItems";
import logo from "@/assets/perpetual_logo.png";
import { useSelector } from "react-redux";

export function AppSidebar({ ...props }) {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role?.includes("Admin");
  const isCoach = user?.role?.includes("Coach");
  const isPlayer = user?.role?.includes("Player");

  // Get the appropriate navigation items based on user role
  const navItems = isCoach ? coachNavigation() : adminNavigation();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src={logo} alt="Perpetual Logo" className="max-h-8" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-extrabold text-yellow-500">
                    UNIVERSITY OF PERPETUAL
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Sports Management
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavs items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
