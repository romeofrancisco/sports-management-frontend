import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TeamStreakIndicator = ({ results = [] }) => {
  if (!results || results.length === 0) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">No recent games</span>
      </div>
    );
  }

  const getStreakColor = (result) => {
    switch (result) {
      case "W":
        return "bg-emerald-500";
      case "L":
        return "bg-rose-500";
      case "D":
        return "bg-amber-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStreakLabel = (result) => {
    switch (result) {
      case "W":
        return "Win";
      case "L":
        return "Loss";
      case "D":
        return "Draw";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex gap-1">
      {results.map((gameResult, index) => (
        <TooltipProvider key={index} delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`${getStreakColor(gameResult.result)} w-2.5 h-2.5 rounded-full cursor-help`}
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>
                {getStreakLabel(gameResult.result)} {gameResult.score} vs {gameResult.opponent}
              </p>
              <p className="text-muted-foreground text-[10px]">{gameResult.date}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default TeamStreakIndicator;