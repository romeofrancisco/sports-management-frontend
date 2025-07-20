import React from "react";
import { Card, CardContent } from "../../../../ui/card";
import { Skeleton } from "../../../../ui/skeleton";
import ProgressOverviewSkeleton from "./ProgressOverviewSkeleton";
import MetricsRecordingFormSkeleton from "./MetricsRecordingFormSkeleton";

const PlayerMetricsRecordingSkeleton = () => {
  return (
    <Card className="h-full pt-0 gap-0 flex flex-col shadow-xl border-2 border-primary/20 bg-card transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 overflow-hidden">
      {/* Header Skeleton */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>

      <CardContent className="space-y-6 flex flex-col h-full p-6 bg-background">
        {/* Progress Overview Skeleton */}
        <div className="space-y-6">
          <ProgressOverviewSkeleton playersCount={3} />
        </div>

        {/* Metrics Recording Form Skeleton */}
        <div className="animate-in fade-in-50 duration-500 delay-200 flex-1">
          <div className="h-full rounded-xl border-2 overflow-hidden">
            <MetricsRecordingFormSkeleton metricsCount={4} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerMetricsRecordingSkeleton;
