import React from "react";
import { Progress } from "../../../../ui/progress";
import { Users, Target } from "lucide-react";

const PlayerProgressBar = ({ currentPlayerIndex, playersWithMetrics }) => {
  const progressPercentage =
    playersWithMetrics.length > 0
      ? ((currentPlayerIndex + 1) / playersWithMetrics.length) * 100
      : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Recording Progress</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="h-4 w-4" />
          <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
        </div>
      </div>
      
      {/* Progress Details */}
      <div className="flex justify-between text-sm mb-2">
        <span className="text-foreground font-medium">
          Player {currentPlayerIndex + 1} of {playersWithMetrics.length}
        </span>
        <span className="text-muted-foreground">
          {playersWithMetrics.length - currentPlayerIndex - 1} remaining
        </span>
      </div>
      
      {/* Enhanced Progress Bar */}
      <div className="relative">
        <Progress 
          value={progressPercentage} 
          className="h-3 bg-secondary/20 border border-primary/20" 
        />
        {/* Progress indicator dots */}
        <div className="flex justify-between absolute top-0 w-full h-3">
          {Array.from({ length: Math.min(playersWithMetrics.length, 10) }, (_, i) => {
            const position = (i / (Math.min(playersWithMetrics.length, 10) - 1)) * 100;
            const isCompleted = i <= currentPlayerIndex * (Math.min(playersWithMetrics.length, 10) - 1) / (playersWithMetrics.length - 1);
            return (
              <div
                key={i}
                className={`w-1 h-full rounded-full ${
                  isCompleted ? 'bg-card shadow-sm border border-primary/20' : 'bg-muted'
                }`}
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerProgressBar;
