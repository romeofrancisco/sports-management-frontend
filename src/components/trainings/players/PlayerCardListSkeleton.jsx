import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Player Card List Skeleton component
 * Displays a skeleton grid that matches the player card layout
 */
const PlayerCardListSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            {/* Player Avatar */}
            <div className="flex items-center justify-center">
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            
            {/* Player Name */}
            <div className="text-center space-y-2">
              <Skeleton className="h-5 w-32 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            
            {/* Player Info */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            {/* Action Button */}
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        ))}
    </div>
  );
};

export default PlayerCardListSkeleton;
