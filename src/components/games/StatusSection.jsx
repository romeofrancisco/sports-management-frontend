import React from "react";
import { cn } from "@/lib/utils";

const statusConfig = {
  in_progress: {
    title: "Live Games",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    borderColor: "border-red-300 dark:border-red-800",
    iconColor: "bg-red-500",
    iconEffect: "animate-pulse",
    ringColor: "ring-red-300 dark:ring-red-800/50",
  },
  scheduled: {
    title: "Scheduled Games",
    color: "text-secondary dark:text-secondary",
    bgColor: "bg-secondary/20 dark:bg-secondary/10",
    borderColor: "border-secondary/40 dark:border-secondary/40",
    iconColor: "bg-secondary",
    iconEffect: "",
    ringColor: "ring-secondary/40 dark:ring-secondary/50",
  },
  completed: {
    title: "Completed Games",
    color: "text-primary dark:text-primary",
    bgColor: "bg-primary/10 dark:bg-primary/5",
    borderColor: "border-primary/40 dark:border-primary/50",
    iconColor: "bg-primary",
    iconEffect: "",
    ringColor: "ring-primary/40 dark:ring-primary/50",
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
