import { Skeleton } from "@/components/ui/skeleton";

export const GameTableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-8 gap-4 px-4 py-3 border-b border-border/50">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-18" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="grid grid-cols-8 gap-4 px-4 py-3 border-b border-border/20">
          {/* Game ID */}
          <Skeleton className="h-4 w-8" />
          
          {/* Teams */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          {/* Status */}
          <Skeleton className="h-6 w-16 rounded-full" />
          
          {/* Date/Time */}
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
          
          {/* Score */}
          <Skeleton className="h-4 w-12" />
          
          {/* Sport */}
          <Skeleton className="h-4 w-14" />
          
          {/* League */}
          <Skeleton className="h-4 w-16" />
          
          {/* Actions */}
          <div className="flex gap-1">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameTableSkeleton;
