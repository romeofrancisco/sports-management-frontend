import React from "react";
import { Skeleton } from "../../../../ui/skeleton";

const PlayerProgressBarSkeleton = ({ playersCount = 3 }) => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between w-full">
        {Array.from({ length: playersCount }, (_, index) => (
          <React.Fragment key={index}>
            {/* Player skeleton with enhanced styling */}
            <div className="flex flex-col items-center">
              {/* Avatar skeleton */}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full border-3 border-muted">
                <Skeleton className="w-full h-full rounded-full" />
              </div>

              {/* Player name skeleton */}
              <div className="mt-2 text-center min-w-0 max-w-16">
                <Skeleton className="h-3 w-12 mx-auto mb-1" />
                {/* Status indicator skeleton */}
                <Skeleton className="h-0.5 w-2 mx-auto rounded-full" />
              </div>
            </div>

            {/* Connector line skeleton */}
            {index < playersCount - 1 && (
              <div className="flex-1 flex items-center mx-2">
                <Skeleton className="w-full h-1 rounded-full" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PlayerProgressBarSkeleton;
