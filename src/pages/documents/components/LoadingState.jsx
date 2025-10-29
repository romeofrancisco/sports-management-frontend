import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Folders Skeleton */}
      <div>
        <div className="flex items-center gap-1 mb-4 text-xl font-semibold">
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col items-center p-4 min-h-[140px] space-y-2">
              <Skeleton className="h-16 w-16 rounded" />
              <Skeleton className="h-4 w-full max-w-[120px]" />
              <Skeleton className="h-3 w-3/4 max-w-[100px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Files Skeleton */}
      <div>
        <Skeleton className="h-6 w-16 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col items-center p-4 min-h-[140px] space-y-2">
              <Skeleton className="h-16 w-16 rounded" />
              <Skeleton className="h-4 w-full max-w-[120px]" />
              <Skeleton className="h-3 w-3/4 max-w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
