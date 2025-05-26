import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TeamStreakIndicator = ({ results = [] }) => {
  // Add console log to debug the actual data we're receiving
  
  if (!results || results.length === 0) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">No recent games</span>
      </div>
    );
  }  const getStreakColor = (result) => {
    // Handle both string format and object format
    const resultValue = typeof result === 'string' ? result : result.result;
    
    switch (resultValue) {
      case "W":
        return "bg-green-500";
      case "L":
        return "bg-red-500";
      case "D":
        return "bg-amber-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStreakLabel = (result) => {
    // Handle both string format and object format
    const resultValue = typeof result === 'string' ? result : result.result;
    
    switch (resultValue) {
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
      {results.map((gameResult, index) => {
        // If gameResult is a string (just "W", "L", "D") instead of an object
        if (typeof gameResult === 'string') {
          return (
            <TooltipProvider key={index} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`${getStreakColor(gameResult)} w-2.5 h-2.5 rounded-full cursor-help`}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p>{getStreakLabel(gameResult)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        
        // If gameResult is an object with result, score, etc.
        return (
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
                {gameResult.date && (
                  <p className="text-muted-foreground text-[10px]">{gameResult.date}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default TeamStreakIndicator;