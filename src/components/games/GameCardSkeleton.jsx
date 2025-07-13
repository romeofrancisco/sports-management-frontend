import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const GameCardSkeleton = () => {
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-lg border-2 border-primary/20 transition-all duration-300 hover:shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teams Display */}
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Score or VS */}
          <div className="flex items-center gap-2 px-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-8 w-8" />
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="space-y-1 text-right">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>

        {/* Game Details */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-3 w-18" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-18" />
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCardSkeleton;
