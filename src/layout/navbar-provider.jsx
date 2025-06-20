import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  adminGroupedNavigation,
  coachGroupedNavigation,
  playerGroupedNavigation,
} from "@/constants/navItems";
import AppNavbar from "./app-navbar";

const NavbarProvider = () => {
  const { user } = useSelector((state) => state.auth);
  // Get navigation items based on user role
  const getUserNavItems = () => {
    if (!user) return [];

    const role = user.role?.toLowerCase();
    switch (role) {
      case "admin":
        return adminGroupedNavigation();
      case "coach":
        return coachGroupedNavigation();
      case "player":
        return playerGroupedNavigation();
      default:
        return [];
    }
  };

  const userNavItems = getUserNavItems();

  return (
    <div className="h-screen bg-background">
      <AppNavbar navItems={userNavItems} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default NavbarProvider;
