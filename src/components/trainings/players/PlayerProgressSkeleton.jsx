import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Player Progress Skeleton component
 * Displays a skeleton that matches the player progress individual view structure
 */
const PlayerProgressSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions Skeleton */}
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Progress Card Skeleton */}
      <Card className="shadow-sm border overflow-hidden pt-0">
        {/* Header Skeleton */}
        <CardHeader className="bg-muted/30 pb-2 border-b py-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Stats Section Skeleton */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Chart Content Skeleton */}
        <div className="space-y-6 p-6">
          {/* Chart Header */}
          <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          
          {/* Metric Selector */}
          <div className="flex gap-4 items-center">
            <div className="w-full sm:w-64">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Chart Area */}
          <Skeleton className="h-80 w-full rounded-lg" />

          {/* Performance Analysis */}
          <div className="space-y-4 pt-6">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PlayerProgressSkeleton;
