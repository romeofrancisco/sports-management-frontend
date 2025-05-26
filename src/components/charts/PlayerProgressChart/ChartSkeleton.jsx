import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Chart Skeleton component
 * Displays a skeleton that matches the actual chart structure
 */
export const ChartSkeleton = () => (
  <div className="space-y-6">
    {/* Chart Header Skeleton */}
    <Card className="border-0 shadow-none">
      <CardHeader>
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <div className="flex gap-4 items-center mt-4">
          <div className="w-full sm:w-64">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Chart Area Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-80 w-full rounded-lg" />
          
          {/* Performance Analysis Section Skeleton */}
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
      </CardContent>
    </Card>
  </div>
);
