import React from "react";
import { CheckCircle2 } from "lucide-react";
import CompletionNavigation from "./CompletionNavigation";
import CompletionStatus from "./CompletionStatus";

const MetricsCompletionMessage = ({
  currentPlayerIndex,
  playersWithMetrics,
  onPreviousPlayer,
  onNextPlayer,
  session,
  navigate,
}) => {
  const isSessionCompleted = session?.status === "completed";
  const isLastPlayer = currentPlayerIndex === playersWithMetrics?.length - 1;
  const totalPlayers = playersWithMetrics?.length || 0;

  const handleViewSummary = () => {
    navigate(`/trainings/sessions/${session.id}/summary`);
  };

  return (
    <div className="p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
      <div className="text-center">
        <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2 mx-auto" />
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
          All Metrics Recorded!
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          Great job! All performance metrics have been captured for this player.
        </p>

        {/* Navigation Buttons */}
        {playersWithMetrics && currentPlayerIndex !== undefined && (
          <CompletionNavigation
            currentPlayerIndex={currentPlayerIndex}
            totalPlayers={totalPlayers}
            onPreviousPlayer={onPreviousPlayer}
            onNextPlayer={onNextPlayer}
            onViewSummary={handleViewSummary}
            isSessionCompleted={isSessionCompleted}
          />
        )}

        {/* Completion Status */}
        <CompletionStatus
          isLastPlayer={isLastPlayer}
          isSessionCompleted={isSessionCompleted}
        />
      </div>
    </div>
  );
};

export default MetricsCompletionMessage;
