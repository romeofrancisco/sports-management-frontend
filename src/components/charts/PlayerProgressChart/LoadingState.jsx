import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state component for chart content
 * Displays a skeleton that matches the chart structure
 */
export const LoadingState = () => (
  <div className="space-y-4 p-6">
    {/* Chart Area Skeleton */}
    <Skeleton className="h-80 w-full rounded-lg" />
    
    {/* Performance Analysis Section Skeleton */}
    <div className="space-y-4 pt-6">
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
