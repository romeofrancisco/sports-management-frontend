import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ContentLoading = ({ count = 3 }) => {
  return (
    <div className="w-full space-y-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex justify-between items-center p-4 border rounded-xl">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full mx-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ContentLoading;
