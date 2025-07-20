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
  const theme = isComplete
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
    <div className={`p-4 sm:p-6 ${theme.container} rounded-xl border`}>
      <div className="text-center">
        {/* Icon */}
        {isComplete ? (
          <CheckCircle2
            className={`h-8 w-8 sm:h-10 sm:w-10 ${theme.icon} mb-3 mx-auto`}
          />
        ) : (
          <Clock
            className={`h-8 w-8 sm:h-10 sm:w-10 ${theme.icon} mb-3 mx-auto`}
          />
        )}

        {/* Title */}
        <h3
          className={`text-base sm:text-lg font-semibold ${theme.title} mb-2`}
        >
          {isComplete
            ? "All Metrics Recorded!"
            : "Metrics Recording In Progress"}
        </h3>

        {/* Description */}
        <p className={`text-xs sm:text-sm ${theme.description} mb-4`}>
          {isComplete
            ? "Great job! All performance metrics have been captured for this player."
            : hasChanges
            ? `Keep going! You've completed ${completedMetrics} of ${totalMetrics} metrics (${progressPercentage}%).`
            : "Ready to start recording metrics for this player."}
        </p>

        {/* Main Content - Progress Bar and Navigation */}
        <div className="mb-4">
          {/* Progress Bar */}
          {totalMetrics > 0 && (
            <div className="mb-4">
              <div className={`w-full ${theme.progress} rounded-full h-2 mb-2`}>
                <div
                  className={`${theme.progressFill} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className={`text-xs ${theme.progressText} mb-4`}>
                {isComplete
                  ? `${completedMetrics} of ${totalMetrics} metrics completed`
                  : `${remainingMetrics} metric${
                      remainingMetrics !== 1 ? "s" : ""
                    } remaining`}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {playersWithMetrics && currentPlayerIndex !== undefined && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onPreviousPlayer}
                disabled={isFirstPlayer}
                className={`flex items-center gap-2 w-full sm:w-auto ${theme.button}`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Player
              </Button>

              <div
                className={`px-3 py-1 ${theme.badge} rounded-full text-xs sm:text-sm font-medium border`}
              >
                {currentPlayerIndex + 1} of {totalPlayers}
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
                  (isLastPlayer && !isSessionCompleted && (!allPlayersComplete || hasEmptyCurrentPlayer))
                }
                className={`flex items-center gap-2 w-full sm:w-auto ${theme.button}`}
              >
                {isLastPlayer && isSessionCompleted ? (
                  <>
                    View Training Summary
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : isLastPlayer && !isSessionCompleted ? (
                  <>
                    Finish Training
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next Player
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Footer - Status Information */}
        <div className="text-center">
          <p className={`text-xs ${theme.tip}`}>
            💡 <strong>Tip:</strong>{" "}
            {isComplete
              ? isLastPlayer && !isSessionCompleted && !allPlayersComplete
                ? "Complete metrics for all players to finish the training session"
                : "All metrics have been successfully recorded for this player"
              : isLastPlayer && !isSessionCompleted
              ? "Complete metrics for all players to finish the training session"
              : "You can navigate between players even with incomplete metrics"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricsStatusMessage;
