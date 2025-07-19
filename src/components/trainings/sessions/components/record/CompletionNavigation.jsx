import React from "react";
import { Button } from "../../../../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CompletionNavigation = ({
  currentPlayerIndex,
  totalPlayers,
  onPreviousPlayer,
  onNextPlayer,
  onViewSummary,
  isSessionCompleted,
}) => {
  const isFirstPlayer = currentPlayerIndex === 0;
  const isLastPlayer = currentPlayerIndex === totalPlayers - 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousPlayer}
        disabled={isFirstPlayer}
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous Player
      </Button>
      
      <div className="px-3 py-1 bg-primary/10 rounded-full text-xs sm:text-sm text-primary font-medium">
        {currentPlayerIndex + 1} of {totalPlayers}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (isLastPlayer && isSessionCompleted) {
            onViewSummary();
          } else {
            onNextPlayer();
          }
        }}
        disabled={isLastPlayer && !isSessionCompleted}
        className="flex items-center gap-2 w-full sm:w-auto"
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
  );
};

export default CompletionNavigation;
