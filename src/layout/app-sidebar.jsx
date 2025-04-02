import * as React from "react";
import { AdminManagementNav } from "./admin-management-nav";
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
import { adminManagement, adminMain } from "@/hooks/useNavItems";
import logo from "@/assets/perpetual_logo.png";
import AdminMainNav from "./admin-main-nav";

export function AppSidebar({ ...props }) {
  const management = adminManagement();
  const main = adminMain();

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
      <AdminMainNav items={main} />
      <SidebarContent>
        <AdminManagementNav items={management} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
