import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Team Card List Skeleton component
 * Displays a skeleton grid that matches the team card layout
 */
const TeamCardListSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4 cursor-pointer hover:shadow-md transition-shadow">
            {/* Team Logo */}
            <div className="flex items-center justify-center">
              <Skeleton className="h-16 w-16 rounded-lg" />
            </div>
            
            {/* Team Name */}
            <div className="text-center space-y-2">
              <Skeleton className="h-5 w-32 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            
            {/* Team Stats */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            
            {/* Action Area */}
            <div className="pt-2">
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default TeamCardListSkeleton;
