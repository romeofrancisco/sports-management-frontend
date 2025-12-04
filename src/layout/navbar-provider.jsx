import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  adminGroupedNavigation,
  coachGroupedNavigation,
  playerGroupedNavigation,
  publicNavigation,
} from "@/constants/navItems";
import AppNavbar from "./app-navbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useLocation } from "react-router-dom";
import ScrollToTop from "@/routes/ScrollToTop";

const NavbarProvider = () => {
  const { user } = useSelector((state) => state.auth);
  // Get navigation items based on user role
  const getUserNavItems = () => {
    if (!user) return publicNavigation();

    const role = user.role?.toLowerCase();
    switch (role) {
      case "admin":
        return adminGroupedNavigation();
      case "coach":
        return coachGroupedNavigation();
      case "player":
        // pass team_slug from user into the helper so the helper doesn't use hooks
        return playerGroupedNavigation(user.team_slug);
      default:
        return [];
    }
  };
  const location = useLocation();

  const userNavItems = getUserNavItems();

  return (
    <div className="bg-background">
      <AppNavbar navItems={userNavItems} />
      <ErrorBoundary>
        <main
          className={`${
            location.pathname === "/" || location.pathname.includes("/scoring")
              ? ""
              : "pt-[64px]"
          }`}
        >
          <ScrollToTop />
          <Outlet />
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default NavbarProvider;
