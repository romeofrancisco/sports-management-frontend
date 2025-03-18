import * as React from "react";
import { AdminManagementNav } from "./admin-management-nav";
import { NavUser } from "./nav-user";
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
import { navItems } from "./navItems";

export function AppSidebar({ ...props }) {

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-7 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src="perpetual_logo.png" alt="Perpetual Logo" />
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
        <AdminManagementNav items={navItems.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
