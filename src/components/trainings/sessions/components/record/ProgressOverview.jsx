import React from "react";
import PlayerProgressBar from "./PlayerProgressBar";
import ProgressLegend from "./ProgressLegend";
import { Dumbbell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="rounded-xl sm:rounded-2xl border-2 border-primary/20">
      <div className="flex flex-col md:flex-row justify-between gap-3 sm:gap-4 border-b-2 border-primary/20 p-3 sm:p-4">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-card shadow-lg ring-2 ring-primary/20 flex-shrink-0">
              <AvatarImage
                src={
                  playersWithMetrics[currentPlayerIndex]?.player?.profile ||
                  playersWithMetrics[currentPlayerIndex]?.player?.user?.profile
                }
              />
              <AvatarFallback>
                {`${
                  playersWithMetrics[currentPlayerIndex]?.player
                    ?.first_name?.[0] || ""
                }${
                  playersWithMetrics[currentPlayerIndex]?.player
                    ?.last_name?.[0] || ""
                }`.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm sm:text-lg font-semibold text-foreground">
                {playersWithMetrics[currentPlayerIndex]?.player?.full_name ||
                  "Player"}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Player {currentPlayerIndex + 1} of {playersWithMetrics.length}
              </p>
            </div>
          </div>
          {/* Mobile progress percentage */}
          <div className="text-right sm:hidden">
            <div className="text-xl font-bold text-primary">
              {Math.round(progressPercentage)}%
            </div>
            <p className="text-[10px] text-muted-foreground">Complete</p>
          </div>
        </div>
        {/* Desktop progress percentage */}
        <div className="text-right hidden sm:block">
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
