import React from "react";
import { cn } from "@/lib/utils";

const statusConfig = {
  in_progress: {
    title: "Live Games",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-gradient-to-br from-red-50/30 to-background dark:from-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "bg-red-500",
    iconEffect: "animate-pulse",
    ringColor: "ring-red-100 dark:ring-red-800/50",
  },
  scheduled: {
    title: "Scheduled Games",
    color: "text-secondary dark:text-secondary",
    bgColor: "bg-gradient-to-br from-secondary/5 to-background dark:from-secondary/10",
    borderColor: "border-secondary/20 dark:border-secondary/30",
    iconColor: "bg-secondary",
    iconEffect: "",
    ringColor: "ring-secondary/10 dark:ring-secondary/20",
  },
  completed: {
    title: "Completed Games",
    color: "text-primary dark:text-primary",
    bgColor: "bg-gradient-to-br from-primary/5 to-background dark:from-primary/10",
    borderColor: "border-primary/20 dark:border-primary/30",
    iconColor: "bg-primary",
    iconEffect: "",
    ringColor: "ring-primary/10 dark:ring-primary/20",
  },
  other: {
    title: "Other Games",
    color: "text-muted-foreground",
    bgColor: "bg-muted/30",
    borderColor: "border-border",
    iconColor: "bg-muted-foreground",
    iconEffect: "",
    ringColor: "ring-border",
  },
};

export const StatusSection = ({ 
  status, 
  games, 
  children, 
  className = "",
  showCount = true,
  customTitle = null,
  variant = "default" // "default" or "minimal"
}) => {
  if (!games || games.length === 0) return null;

  const config = statusConfig[status] || statusConfig.other;
  const title = customTitle || config.title;
  if (variant === "minimal") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-3">
          <div className={cn("w-3 h-3 rounded-full", config.iconColor, config.iconEffect)} />
          <h3 className={cn("text-lg font-semibold", config.color)}>
            {title}
          </h3>
          {showCount && (
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm",
              config.color,
              config.bgColor,
              config.borderColor
            )}>
              {games.length} {games.length === 1 ? 'game' : 'games'}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with enhanced styling to match GameCard */}
      <div className={cn(
        "flex items-center justify-between p-4 rounded-lg border ring-1 shadow-md",
        config.bgColor,
        config.borderColor,
        config.ringColor
      )}>
        <div className="flex items-center gap-3">
          <div className={cn("w-3 h-3 rounded-full", config.iconColor, config.iconEffect)} />
          <h3 className={cn("text-lg font-semibold", config.color)}>
            {title}
          </h3>
        </div>
        {showCount && (
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium border shadow-sm",
            config.color,
            "bg-background/80 backdrop-blur-sm",
            config.borderColor
          )}>
            {games.length} {games.length === 1 ? 'game' : 'games'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default StatusSection;
