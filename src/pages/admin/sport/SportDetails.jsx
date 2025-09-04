import React from "react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import {
  SportStatsView,
  SportFormulasView,
  SportLeadersView,
  SportPositionsView,
} from "./components";
import { useParams, Link, useLocation } from "react-router-dom";
import { useSportDetails } from "@/hooks/useSports";
import { cn } from "@/lib/utils";
import { CheckCircle, Calculator, Users, Trophy } from "lucide-react";

const Sport = () => {
  const { sport } = useParams();
  const location = useLocation();
  const { data: sportDetails } = useSportDetails(sport);

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
    <div className="p-3 sm:p-4 md:p-6">
      <UniversityPageHeader
        title={sportDetails?.name || sport}
        subtitle="Sport Management"
        description="Manage sport statistics, formulas, leader categories, and player positions"
        showBackButton={true}
        backButtonText="Back to Sports"
        backButtonPath="/sports"
        showUniversityColors={true}
      />

      {/* Navigation Links */}
      <div className="mb-4 sm:mb-6">
        <nav className="border-b border-border">
          <div className="flex space-x-2 sm:space-x-3 overflow-x-auto scrollbar-hide">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={cn(
                    "group inline-flex items-center py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200",
                    currentPage === item.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <IconComponent
                    className={cn(
                      "mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 transition-colors duration-200",
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
  );
};

export default Sport;
