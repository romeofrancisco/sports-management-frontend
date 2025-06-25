import React from "react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart2, Users } from "lucide-react";
import { OverviewTab, PlayersTabContainer } from "@/components/trainings/attendance/components";

const AttendanceAnalyticsPage = () => {
  const location = useLocation();
  const navigationItems = [
    { key: "overview", label: "Overview", icon: BarChart2, path: "/trainings/attendance" },
    { key: "players", label: "Players", icon: Users, path: "/trainings/attendance/players" },
  ];
  const currentPath = location.pathname;
  const getCurrentPage = () => (currentPath.includes("/players") ? "players" : "overview");
  const activePage = getCurrentPage();

  // Render content based on activePage
  const renderContent = () => {
    if (activePage === "overview") {
      return <OverviewTab />;
    }
    if (activePage === "players") {
      return <PlayersTabContainer />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Attendance Analytics"
          subtitle="Training Management"
          description="View detailed attendance reports and analytics"
          showUniversityColors={true}
          showBackButton={true}
          backButtonText="Back to Training"
          backButtonPath="/trainings"
        />
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
                      activePage === item.key
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "mr-2 h-4 w-4 transition-colors duration-200",
                        activePage === item.key
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
        {renderContent()}
      </div>
    </div>
  );
};

export default AttendanceAnalyticsPage;
