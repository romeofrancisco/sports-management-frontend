import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TeamLogo = ({ team, isScheduled, isReady, lineupType }) => {
  // Only show lineup status for scheduled games
  const showLineupStatus = isScheduled !== undefined && isScheduled;

  const getTooltipText = () => {
    if (!showLineupStatus) return "";
    const teamType = lineupType === "home" ? "Home" : "Away";
    return isReady
      ? `${teamType} lineup is ready`
      : `${teamType} lineup is pending`;
  };

  const logoContent = team.logo ? (
    <div className="w-14 h-14 flex items-center justify-center p-1 rounded-lg border border-primary/10 bg-background/50 relative">
      <img
        src={team.logo}
        alt={team.name || ""}
        className="max-w-full max-h-full object-contain"
      />
      {/* Lineup Status Dot */}
      {showLineupStatus && (
        <div className="absolute -bottom-1 -right-1 z-10">
          <div
            className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
              isReady ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
      )}
    </div>
  ) : (
    <div
      className="w-14 h-14 flex items-center justify-center text-xs font-bold rounded-lg border border-primary/20 relative"
      style={{
        backgroundColor: team.color || "hsl(var(--primary))",
        color: team.color ? "#fff" : "hsl(var(--primary-foreground))",
      }}
    >
      {(team.name || "T").charAt(0)}
      {/* Lineup Status Dot */}
      {showLineupStatus && (
        <div className="absolute -bottom-1 -right-1 z-10">
          <div
            className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
              isReady ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
      )}
    </div>
  );

  // If we don't need to show lineup status, return logo without tooltip
  if (!showLineupStatus) {
    return logoContent;
  }

  // Return logo with tooltip for scheduled games
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{logoContent}</TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
