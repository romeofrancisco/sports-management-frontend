import React from "react";
import { CheckCircle2, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../ui/button";

const MetricsStatusMessage = ({
  currentPlayerIndex,
  playersWithMetrics,
  onPreviousPlayer,
  onNextPlayer,
  onFinishTraining,
  session,
  navigate,
  completedMetrics,
  totalMetrics,
  hasChanges,
  isComplete = false,
  hasValidMetrics = true,
  hasZeroValues = false,
  allPlayersComplete = false,
  hasEmptyCurrentPlayer = false,
}) => {
  const isSessionCompleted = session?.status === "completed";
  const isLastPlayer = currentPlayerIndex === playersWithMetrics?.length - 1;
  const isFirstPlayer = currentPlayerIndex === 0;
  const totalPlayers = playersWithMetrics?.length || 0;

  const handleViewSummary = () => {
    navigate(`/trainings/sessions/${session.id}/summary`);
  };

  const remainingMetrics = totalMetrics - completedMetrics;
  const progressPercentage =
    totalMetrics > 0 ? Math.round((completedMetrics / totalMetrics) * 100) : 0;

  // Determine theme and content based on completion status
  // Only show completed theme when current player is complete AND all players are complete
  const isFullyComplete = isComplete && allPlayersComplete;
  const theme = isFullyComplete
    ? {
        container:
          "bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30",
        icon: "text-primary",
        title: "text-foreground",
        description: "text-muted-foreground",
        progress: "bg-primary/10 dark:bg-primary/20",
        progressFill: "bg-primary",
        progressText: "text-primary",
        button:
          "border-primary/30 dark:border-primary/50 text-primary hover:bg-primary/5 dark:hover:bg-primary/10",
        badge:
          "bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30",
        tip: "text-primary",
      }
    : {
        container:
          "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30",
        icon: "text-amber-600 dark:text-amber-400",
        title: "text-amber-800 dark:text-amber-200",
        description: "text-amber-700 dark:text-amber-300",
        progress: "bg-amber-100 dark:bg-amber-900/30",
        progressFill: "bg-amber-500 dark:bg-amber-400",
        progressText: "text-amber-600 dark:text-amber-400",
        button:
          "border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20",
        badge:
          "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/30",
        tip: "text-amber-600 dark:text-amber-400",
      };

  return (
    <div className={`p-4 sm:p-5 ${theme.container} rounded-xl border shadow-sm`}>
      {/* Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {isFullyComplete ? (
            <div className={`p-2 rounded-lg ${theme.icon} bg-primary/10`}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
          ) : (
            <div className={`p-2 rounded-lg ${theme.icon} bg-amber-500/10`}>
              <Clock className="h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className={`text-sm sm:text-base font-semibold ${theme.title}`}>
              {isFullyComplete ? "Metrics Complete" : "Recording Metrics"}
            </h3>
            <p className={`text-xs ${theme.description}`}>
              {completedMetrics} of {totalMetrics} completed
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        {totalMetrics > 0 && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-full sm:w-32 lg:w-40">
              <div className={`${theme.progress} rounded-full h-2`}>
                <div
                  className={`${theme.progressFill} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <span className={`text-lg font-bold ${theme.progressText} min-w-[3rem] text-right`}>
              {progressPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {playersWithMetrics && currentPlayerIndex !== undefined && (
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPlayer}
            disabled={isFirstPlayer}
            className={`flex items-center gap-1.5 px-3 py-2 ${theme.button} transition-all`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div
            className={`flex-1 text-center px-3 py-2 ${theme.badge} rounded-lg text-sm font-semibold border min-w-[4rem]`}
          >
            <span className="hidden xs:inline">{currentPlayerIndex + 1} of {totalPlayers}</span>
            <span className="xs:hidden">{currentPlayerIndex + 1}/{totalPlayers}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isLastPlayer && isSessionCompleted) {
                handleViewSummary();
              } else if (
                isLastPlayer &&
                !isSessionCompleted &&
                allPlayersComplete &&
                !hasEmptyCurrentPlayer
              ) {
                onFinishTraining();
              } else {
                onNextPlayer();
              }
            }}
            disabled={
              hasZeroValues ||
              (!hasValidMetrics && hasChanges) ||
              (isLastPlayer &&
                !isSessionCompleted &&
                (!allPlayersComplete || hasEmptyCurrentPlayer))
            }
            className={`flex items-center gap-1.5 px-3 py-2 ${theme.button} transition-all`}
          >
            <span className="hidden sm:inline">
              {isLastPlayer && isSessionCompleted
                ? "View Summary"
                : isLastPlayer && !isSessionCompleted
                ? "Finish"
                : "Next"}
            </span>
            <span className="sm:hidden">
              {isLastPlayer ? "Finish" : "Next"}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MetricsStatusMessage;
