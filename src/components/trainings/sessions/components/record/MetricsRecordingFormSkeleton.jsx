import React from "react";
import { Skeleton } from "../../../../ui/skeleton";

const MetricsRecordingFormSkeleton = ({ metricsCount = 4 }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Form Header Skeleton */}
      <div className="p-6 border-b">
        {/* Combined Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left: Player Info */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {/* Center: Metrics Status */}
          <div className="flex justify-center items-center">
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          {/* Right: Player Statistics */}
          <div className="flex justify-end">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
        {Array.from({ length: metricsCount }, (_, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            {/* Metric Header */}
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="w-12 h-6 rounded" />
            </div>

            {/* Value Input Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="w-full h-10 rounded-md" />
            </div>

            {/* Notes Input Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="w-full h-20 rounded-md" />
            </div>

            {/* Improvement Badge Skeleton */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message Skeleton */}
      <div className="p-3 sm:p-6 border-t">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsRecordingFormSkeleton;
