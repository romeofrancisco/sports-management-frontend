import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PlayersListSkeleton = ({ viewMode = "cards", itemCount = 12 }) => {
  const cardSkeletonItems = Array.from({ length: itemCount }, (_, i) => i);
  const tableSkeletonItems = Array.from({ length: Math.min(itemCount, 10) }, (_, i) => i);

  return (
      <Card className="gap-0 p-0 rounded-none border-none shadow-none">
        <div className="relative">
          {/* Content Skeleton */}
          {viewMode === "cards" ? (
            <div className="p-4 sm:p-6">
              {/* Cards Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {cardSkeletonItems.map((_, index) => (
                  <Card
                    key={index}
                    className="w-full p-4 space-y-4 bg-muted/10 border-muted/20 animate-pulse"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Player Avatar */}
                    <div className="flex items-center justify-center">
                      <Skeleton className="h-16 w-16 rounded-full bg-muted" />
                    </div>
                    
                    {/* Player Name */}
                    <div className="text-center space-y-2">
                      <Skeleton className="h-5 w-3/4 mx-auto bg-muted" />
                      <Skeleton className="h-4 w-1/2 mx-auto bg-muted" />
                    </div>
                    
                    {/* Player Info */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-12 bg-muted" />
                        <Skeleton className="h-4 w-16 bg-muted" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-16 bg-muted" />
                        <Skeleton className="h-4 w-20 bg-muted" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-14 bg-muted" />
                        <Skeleton className="h-4 w-18 bg-muted" />
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3">
                      <Skeleton className="h-8 flex-1 bg-muted rounded-md" />
                      <Skeleton className="h-8 w-8 bg-muted rounded-md" />
                      <Skeleton className="h-8 w-8 bg-muted rounded-md" />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-muted/20">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24 bg-muted" />
                  <Skeleton className="h-8 w-16 bg-muted rounded" />
                  <Skeleton className="h-4 w-16 bg-muted" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 bg-muted rounded" />
                  <Skeleton className="h-8 w-8 bg-muted rounded" />
                  <Skeleton className="h-8 w-8 bg-muted rounded" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Table View Skeleton */}
              <Card className="border-none shadow-none">
                {/* Table Header (hidden on small screens) */}
                <div className="hidden sm:block p-4 border-b border-muted">
                  <div className="grid grid-cols-6 gap-4">
                    {['Player', 'Sport', 'Year Level', 'Course', 'Status', 'Actions'].map((_, index) => (
                      <Skeleton 
                        key={index}
                        className="h-4 bg-muted" 
                        style={{ animationDelay: `${index * 50}ms` }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Table Rows */}
                <div className="divide-y divide-muted/20">
                  {tableSkeletonItems.map((_, index) => (
                    <div 
                      key={index}
                      className="p-4 animate-pulse"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
                        {/* Player Column */}
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full bg-muted" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24 bg-muted" />
                            <Skeleton className="h-3 w-20 bg-muted" />
                          </div>
                        </div>
                        
                        {/* Other Columns - full width on mobile */}
                        <Skeleton className="h-4 w-full sm:w-16 bg-muted" />
                        <Skeleton className="h-4 w-full sm:w-12 bg-muted" />
                        <Skeleton className="h-4 w-full sm:w-20 bg-muted" />
                        <Skeleton className="h-6 w-full sm:w-16 bg-muted rounded-full" />
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8 bg-muted rounded" />
                          <Skeleton className="h-8 w-8 bg-muted rounded" />
                          <Skeleton className="h-8 w-8 bg-muted rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Table Pagination Skeleton */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 px-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32 bg-muted" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20 bg-muted rounded" />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <Skeleton 
                        key={index}
                        className="h-8 w-8 bg-muted rounded" 
                      />
                    ))}
                  </div>
                  <Skeleton className="h-8 w-20 bg-muted rounded" />
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
  );
};

export default PlayersListSkeleton;
