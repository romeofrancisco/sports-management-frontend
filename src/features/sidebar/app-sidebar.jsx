import * as React from "react";
import { Volleyball, Users } from "lucide-react";

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
import { useSports } from "@/hooks/queries/useSports";

export function AppSidebar({ ...props }) {
  const { data, isLoading, isError } = useSports();

  if(isLoading) return null

  const datas = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Sports",
        url: "#",
        icon: Volleyball,
        isActive: true,
        items: [
          ...data?.map((item) => ({
            title: item.name,
            url: "#",
          })) || [],
        ],
      },
      {
        title: "Teams",
        url: "#",
        icon: Users,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
    ],
  };

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
        <AdminManagementNav items={datas.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={datas.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
