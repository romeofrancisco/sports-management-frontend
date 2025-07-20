import React from "react";
import { Skeleton } from "../../../../ui/skeleton";
import { Card, CardContent } from "../../../../ui/card";
import PlayerProgressBarSkeleton from "./PlayerProgressBarSkeleton";

const ProgressOverviewSkeleton = ({ playersCount = 3 }) => {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-0">
        {/* Progress header skeleton */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          {/* Progress bar skeleton */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="w-full h-3 rounded-full" />
          </div>
        </div>

        {/* Player progress bar skeleton */}
        <PlayerProgressBarSkeleton playersCount={playersCount} />
      </CardContent>
    </Card>
  );
};

export default ProgressOverviewSkeleton;
