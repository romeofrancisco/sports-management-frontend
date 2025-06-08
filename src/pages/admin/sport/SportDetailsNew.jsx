import React from "react";
import SportDetailsHeader from "./components/SportDetailsHeader";
import SportStatsView from "./components/SportStatsView";
import SportFormulasView from "./components/SportFormulasView";
import SportLeadersView from "./components/SportLeadersView";
import SportPositionsView from "./components/SportPositionsView";
import { useParams, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Calculator,
  Users,
  Trophy
} from "lucide-react";

const Sport = () => {
  const { sport } = useParams();
  const location = useLocation();
  
  // Get current page from URL path
  const currentPath = location.pathname;
  
  const getCurrentPage = () => {
    if (currentPath.includes("/stats")) return "stats";
    if (currentPath.includes("/formulas")) return "formulas";
    if (currentPath.includes("/leaders")) return "leaders";
    if (currentPath.includes("/positions")) return "positions";
    return "stats"; // default to stats
  };

  const currentPage = getCurrentPage();

  // Navigation items for the sport details
  const navigationItems = [
    {
      key: "stats",
      label: "Stats",
      path: `/sports/${sport}/stats`,
      description: "Sport statistics and data",
      icon: CheckCircle,
    },
    {
      key: "formulas",
      label: "Formulas",
      path: `/sports/${sport}/formulas`,
      description: "Statistical formulas and calculations",
      icon: Calculator,
    },
    {
      key: "leaders",
      label: "Leaders",
      path: `/sports/${sport}/leaders`,
      description: "Leader categories and rankings",
      icon: Trophy,
    },
    {
      key: "positions",
      label: "Positions",
      path: `/sports/${sport}/positions`,
      description: "Player positions and roles",
      icon: Users,
    },
  ];

  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case "stats":
        return <SportStatsView />;
      case "formulas":
        return <SportFormulasView />;
      case "leaders":
        return <SportLeadersView />;
      case "positions":
        return <SportPositionsView />;
      default:
        return <SportStatsView />;
    }
  };

  return (
    <div className="w-full max-w-screen overflow-x-hidden bg-background">
      <SportDetailsHeader />

      <div className="container mx-auto px-4 py-6">
        {/* Navigation Links */}
        <div className="mb-4">
          <nav className="border-b border-border">
            <div className="flex space-x-3 overflow-x-auto">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={cn(
                      "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200",
                      currentPage === item.key
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "mr-2 h-4 w-4 transition-colors duration-200",
                        currentPage === item.key
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Sport;
