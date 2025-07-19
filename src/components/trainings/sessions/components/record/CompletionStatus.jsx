import React from "react";
import { Target, PartyPopper } from "lucide-react";

const CompletionStatus = ({ isLastPlayer, isSessionCompleted }) => {
  if (!isLastPlayer) return null;

  return (
    <div className="p-3 bg-primary/10 rounded-lg">
      <div className="flex items-center gap-2 justify-center">
        {isSessionCompleted ? (
          <Target className="h-4 w-4 text-primary" />
        ) : (
          <PartyPopper className="h-4 w-4 text-primary" />
        )}
        <p className="text-xs sm:text-sm text-primary font-medium text-center">
          {isSessionCompleted
            ? "Training session completed! Click to view the training summary."
            : "This is the last player! You're all done!"}
        </p>
      </div>
    </div>
  );
};

export default CompletionStatus;
