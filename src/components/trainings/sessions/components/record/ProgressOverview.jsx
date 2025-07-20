import React from "react";
import PlayerProgressBar from "./PlayerProgressBar";
import ProgressLegend from "./ProgressLegend";
import { Dumbbell } from "lucide-react";

const ProgressOverview = ({
  currentPlayerIndex,
  playersWithMetrics,
  progressPercentage,
  isNavigating,
  onNavigateToPlayer,
}) => {
  // This component should only handle navigation through the progress bar
  // The main form component will handle the data and validation
  
  return (
    <div className="rounded-2xl border-2 border-primary/20">
      <div className="grid grid-cols-3 border-b-2 border-primary/20 p-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Dumbbell className="size-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              Training Progress
            </p>
            <p className="text-sm text-muted-foreground">
              Player {currentPlayerIndex + 1} of {playersWithMetrics.length}
            </p>
          </div>
        </div>
        <ProgressLegend />
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {Math.round(progressPercentage)}%
          </div>
          <p className="text-xs text-muted-foreground">Complete</p>
        </div>
      </div>

      <PlayerProgressBar
        playersWithMetrics={playersWithMetrics}
        currentPlayerIndex={currentPlayerIndex}
        navigateToPlayer={onNavigateToPlayer}
        isNavigating={isNavigating}
      />
    </div>
  );
};

export default ProgressOverview;
