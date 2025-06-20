import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SessionCardSkeleton = () => (
  <Card className="relative overflow-hidden bg-gradient-to-br from-muted/10 to-muted/20 border-0 shadow-sm h-full flex flex-col animate-pulse">
    <div className="absolute top-0 left-0 right-0 h-1 bg-muted" />
    <CardHeader className="pb-2 pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div>
            <CardTitle className="h-5 w-32 mb-2">
              <Skeleton className="h-5 w-32" />
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
        </div>
        <div className="text-right">
          <Skeleton className="h-6 w-10 mb-1 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-3 pt-0">
      <div className="flex items-center justify-between py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <div className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex p-2 rounded border items-start min-h-[60px] bg-muted/20">
            <div className="w-48 flex-shrink-0 pr-3">
              <Skeleton className="h-4 w-32 mb-1 rounded" />
              <Skeleton className="h-3 w-24 ml-5 rounded" />
            </div>
            <div className="flex-1 px-3">
              <Skeleton className="h-4 w-20 mb-1 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
            <div className="w-24 flex-shrink-0 flex justify-end">
              <Skeleton className="h-5 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default SessionCardSkeleton;
