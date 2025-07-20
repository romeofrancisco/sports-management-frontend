import React from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../ui/button";

const MetricsIncompleteMessage = ({
  currentPlayerIndex,
  playersWithMetrics,
  onPreviousPlayer,
  onNextPlayer,
  session,
  navigate,
  completedMetrics,
  totalMetrics,
  hasChanges,
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

  return (
    <div className="p-4 sm:p-6 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
      <div className="text-center">
        {/* Icon */}
        <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-amber-600 dark:text-amber-400 mb-3 mx-auto" />

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
          Metrics Recording In Progress
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 mb-4">
          {hasChanges
            ? `Keep going! You've completed ${completedMetrics} of ${totalMetrics} metrics (${progressPercentage}%).`
            : `Ready to start recording metrics for this player.`}
        </p>

        {/* Main Content - Progress Bar and Navigation */}
        <div className="mb-4">
          {/* Progress Bar */}
          {totalMetrics > 0 && (
            <div className="mb-4">
              <div className="w-full bg-amber-100 dark:bg-amber-900/30 rounded-full h-2 mb-2">
                <div
                  className="bg-amber-500 dark:bg-amber-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
                {remainingMetrics} metric{remainingMetrics !== 1 ? "s" : ""}{" "}
                remaining
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
                className="flex items-center gap-2 w-full sm:w-auto border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Player
              </Button>

              <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full text-xs sm:text-sm text-amber-700 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-800/30">
                {currentPlayerIndex + 1} of {totalPlayers}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (isLastPlayer && isSessionCompleted) {
                    handleViewSummary();
                  } else {
                    onNextPlayer();
                  }
                }}
                disabled={isLastPlayer && !isSessionCompleted}
                className="flex items-center gap-2 w-full sm:w-auto border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                {isLastPlayer && isSessionCompleted ? (
                  <>
                    View Training Summary
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
          {isLastPlayer && !isSessionCompleted ? (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              💡 <strong>Tip:</strong> Complete metrics for all players to
              finish the training session
            </p>
          ) : (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              💡 <strong>Tip:</strong> You can navigate between players even
              with incomplete metrics
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsIncompleteMessage;
