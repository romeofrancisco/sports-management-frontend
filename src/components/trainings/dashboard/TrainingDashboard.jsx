import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import {
  Calendar,
  Users,
  BarChart3,
  FolderOpen,
  Target,
  Ruler,
  ExternalLink,
} from "lucide-react";

import { useSelector } from "react-redux";

const TrainingDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Get user roles
  const isCoach = user?.roles?.includes("coach");

  // Define navigation items
  const navigationItems = [
    {
      label: "Training Sessions",
      icon: Calendar,
      path: "/trainings/sessions",
      description: "Manage training sessions",
    },
    {
      label: "Player Progress",
      icon: Users,
      path: "/trainings/progress",
      description: "Track player improvements",
    },
    {
      label: "Attendance Analytics",
      icon: BarChart3,
      path: "/trainings/attendance",
      description: "View attendance reports",
    },
    {
      label: "Categories",
      icon: FolderOpen,
      path: "/trainings/categories",
      description: "Manage training categories",
    },
    {
      label: "Metrics",
      icon: Target,
      path: "/trainings/metrics",
      description: "Configure performance metrics",
    },
    {
      label: "Units",
      icon: Ruler,
      path: "/trainings/units",
      description: "Manage measurement units",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Header Section */}
        <UniversityPageHeader
          title="Training Management"
          subtitle="Training Portal"
          description="Monitor and track player improvements through comprehensive training analysis"
          showUniversityColors={true}
        />

        {/* Navigation Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path} className="group">
                <div
                  className={`
                    relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-xl
                    bg-gradient-to-br from-card via-card to-card/95 shadow-lg border-primary/20
                    hover:border-primary/30 hover:scale-[1.02] overflow-hidden
                    ${
                      isActive
                        ? "border-primary bg-gradient-to-br from-primary/5 via-card to-card/95 shadow-xl scale-[1.02]"
                        : "hover:border-primary/50"
                    }
                  `}
                >
                  {/* Enhanced background effects */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

                  <div className="relative flex items-start space-x-4">
                    <div
                      className={`
                        p-3 rounded-lg transition-all duration-300 shadow-md
                        ${
                          isActive
                            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg"
                            : "bg-gradient-to-r from-card/60 via-card/80 to-card/60 backdrop-blur-md border border-primary/30 group-hover:bg-gradient-to-r group-hover:from-primary/20 group-hover:to-primary/30"
                        }
                      `}
                    >
                      <Icon
                        className={`w-6 h-6 transition-all duration-300 ${
                          isActive ? "animate-pulse" : "group-hover:scale-110"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`
                            text-lg font-bold transition-all duration-300 tracking-tight
                            ${
                              isActive
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary"
                            }
                          `}
                        >
                          {item.label}
                        </h3>
                        <ExternalLink
                          className={`
                            w-4 h-4 transition-all duration-300
                            ${
                              isActive
                                ? "text-primary opacity-100 animate-bounce"
                                : "text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary"
                            }
                          `}
                        />
                      </div>

                      <p className="text-sm text-muted-foreground mt-2 font-medium">
                        {item.description}
                      </p>

                      {isActive && (
                        <Badge
                          variant="default"
                          className="mt-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg border border-primary/30 transition-all duration-300"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Enhanced decorative gradient overlay */}
                  <div
                    className={`
                      absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
                      ${
                        isActive
                          ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-100"
                          : "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-70"
                      }
                    `}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;
