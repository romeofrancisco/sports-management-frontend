import React from "react";
import { Link, useLocation } from "react-router-dom";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import TrainingOverview from "./components/training/TrainingOverview";
import TrainingProgress from "./components/training/TrainingProgress";
import AssignedTraining from "./components/training/AssignedTraining";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, Calendar, Target } from "lucide-react";

const TrainingPage = () => {
  const location = useLocation();

  // Get current page from URL path
  const currentPath = location.pathname;
  const getCurrentPage = () => {
    if (currentPath.includes("/assigned")) return "assigned";
    if (currentPath.includes("/sessions")) return "sessions";
    if (currentPath.includes("/progress")) return "progress";
    return "overview"; // default to overview
  };

  const currentPage = getCurrentPage();  // Navigation items for the training section
  const navigationItems = [
    {
      key: "overview",
      label: "Overview",
      path: "/trainings",
      description: "Training overview and summary",
      icon: Trophy,
    },
    {
      key: "assigned",
      label: "Assigned Training",
      path: "/trainings/assigned",
      description: "View assigned training metrics",
      icon: Target,
    },
    {
      key: "progress",
      label: "My Progress",
      path: "/trainings/progress",
      description: "Individual performance tracking",
      icon: TrendingUp,
    },
  ];  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case "overview":
        return <TrainingOverview />;
      case "assigned":
        return <AssignedTraining />;
      case "progress":
        return <TrainingProgress />;
      default:
        return <TrainingOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Training"
          subtitle="Training Management"
          description="Track your training progress and performance"
          showUniversityColors={true}
        />

        {/* Navigation Links */}
        <div className="my-4">
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

export default TrainingPage;
