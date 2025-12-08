import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../ui/avatar";
import { Check, Loader2 } from "lucide-react";
import PlayerProgressBarSkeleton from "./PlayerProgressBarSkeleton";

const PlayerProgressBar = ({
  playersWithMetrics,
  currentPlayerIndex,
  navigateToPlayer,
  isNavigating = false,
}) => {
  return (
    <div className="p-3 sm:p-6 md:p-8 overflow-x-auto">
      <div className="flex items-center justify-between w-full min-w-max sm:min-w-0 gap-2">
        {playersWithMetrics.map((playerRecord, index) => {
          const isActive = index === currentPlayerIndex;
          const isComplete =
            playerRecord.metric_records &&
            playerRecord.metric_records.length > 0 &&
            playerRecord.metric_records.every(
              (record) =>
                record.value !== null &&
                record.value !== "" &&
                !isNaN(parseFloat(record.value))
            );
          
          const hasPartialData =
            !isComplete &&
            playerRecord.metric_records &&
            playerRecord.metric_records.length > 0 &&
            playerRecord.metric_records.some(
              (record) =>
                record.value !== null &&
                record.value !== "" &&
                !isNaN(parseFloat(record.value))
            );

          return (
            <React.Fragment key={playerRecord.id}>
              {/* Player dot with enhanced styling */}
              <div className="flex flex-col items-center group">
                <button
                  onClick={() => !isNavigating && navigateToPlayer?.(index)}
                  disabled={isNavigating}
                  className={`
                    relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 sm:border-3 transition-all duration-300 overflow-hidden
                    ${
                      !isActive &&
                      !isNavigating &&
                      "hover:scale-110 cursor-pointer transform-gpu"
                    }
                    ${
                      isActive
                        ? "border-primary shadow-lg scale-125 ring-4 ring-primary/20"
                        : isComplete
                        ? "border-green-500 hover:border-green-600 shadow-md hover:shadow-lg"
                        : hasPartialData
                        ? "border-secondary hover:border-secondary/80 shadow-md hover:shadow-lg"
                        : "border-muted hover:border-muted-foreground hover:shadow-md"
                    }
                    ${isNavigating ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  title={`Navigate to ${playerRecord.player?.first_name} ${playerRecord.player?.last_name}`}
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={
                        playerRecord.player?.profile ||
                        playerRecord.player?.user?.profile
                      }
                      alt={`${playerRecord.player?.first_name} ${playerRecord.player?.last_name}`}
                      className="object-cover"
                    />
                    <AvatarFallback
                      className={`
                        w-full h-full text-xs font-semibold flex items-center justify-center
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : isComplete
                            ? "bg-green-500 text-white"
                            : hasPartialData
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {isActive && isNavigating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isComplete ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        `${playerRecord.player?.first_name?.[0] || ""}${
                          playerRecord.player?.last_name?.[0] || ""
                        }`.toUpperCase() || index + 1
                      )}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Player name with enhanced styling */}
                <div className="mt-1.5 sm:mt-2 text-center min-w-0 max-w-12 sm:max-w-16">
                  <div
                    className={`text-[10px] sm:text-xs font-medium truncate transition-colors duration-200 ${
                      isActive
                        ? "text-primary font-semibold"
                        : isComplete
                        ? "text-green-600"
                        : hasPartialData
                        ? "text-secondary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {playerRecord.player?.first_name}
                  </div>
                </div>
              </div>

              {/* Enhanced connector line */}
              {index < playersWithMetrics.length - 1 && (
                <div className="flex-1 flex items-center mx-1 sm:mx-2">
                  <div
                    className={`
                    w-full h-0.5 sm:h-1 rounded-full transition-all duration-300 relative overflow-hidden
                    ${isComplete ? "bg-green-500" : hasPartialData ? "bg-secondary" : "bg-muted"}
                  `}
                  >
                    {isComplete && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                    )}
                    {hasPartialData && !isComplete && (
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 to-secondary rounded-full"></div>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerProgressBar;
