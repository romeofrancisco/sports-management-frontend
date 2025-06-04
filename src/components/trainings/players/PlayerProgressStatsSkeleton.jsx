import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Player Progress Stats Skeleton component
 * Displays skeleton for player statistics cards
 */
const PlayerProgressStatsSkeleton = () => {
  return (    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <Skeleton className="h-10 w-10 rounded-lg" />
              
              {/* Content */}
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlayerProgressStatsSkeleton;
