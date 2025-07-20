import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../ui/avatar";
import { Check, Loader2 } from "lucide-react";
import PlayerProgressBarSkeleton from "./PlayerProgressBarSkeleton";

const PlayerProgressBar = ({ 
  playersWithMetrics, 
  currentPlayerIndex, 
  navigateToPlayer, 
  isNavigating = false 
}) => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between w-full">
        {playersWithMetrics.map((playerRecord, index) => {
          const isActive = index === currentPlayerIndex;
          const hasData =
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
                    relative flex items-center justify-center w-10 h-10 rounded-full border-3 transition-all duration-300 overflow-hidden
                    ${
                      !isActive &&
                      !isNavigating &&
                      "hover:scale-110 cursor-pointer transform-gpu"
                    }
                    ${
                      isActive
                        ? "border-primary shadow-lg scale-125 ring-4 ring-primary/20"
                        : hasData
                        ? "border-green-500 hover:border-green-600 shadow-md hover:shadow-lg"
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
                            : hasData
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {isActive && isNavigating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : hasData ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        `${playerRecord.player?.first_name?.[0] || ""}${
                          playerRecord.player?.last_name?.[0] || ""
                        }`.toUpperCase() || index + 1
                      )}
                    </AvatarFallback>
                  </Avatar>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-card shadow-sm"></div>
                  )}
                </button>

                {/* Player name with enhanced styling */}
                <div className="mt-2 text-center min-w-0 max-w-16">
                  <div
                    className={`text-xs font-medium truncate transition-colors duration-200 ${
                      isActive
                        ? "text-primary font-semibold"
                        : hasData
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {playerRecord.player?.first_name}
                  </div>
                  {/* Status indicator */}
                  <div
                    className={`mt-1 w-2 h-0.5 mx-auto rounded-full transition-colors duration-200 ${
                      isActive
                        ? "bg-primary"
                        : hasData
                        ? "bg-green-500"
                        : "bg-muted"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Enhanced connector line */}
              {index < playersWithMetrics.length - 1 && (
                <div className="flex-1 flex items-center mx-2">
                  <div
                    className={`
                    w-full h-1 rounded-full transition-all duration-300 relative overflow-hidden
                    ${hasData ? "bg-green-500" : "bg-muted"}
                  `}
                  >
                    {hasData && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
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
