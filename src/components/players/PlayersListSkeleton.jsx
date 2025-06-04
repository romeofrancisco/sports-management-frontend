import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PlayersListSkeleton = ({ viewMode = "cards", itemCount = 12 }) => {
  const cardSkeletonItems = Array.from({ length: itemCount }, (_, i) => i);
  const tableSkeletonItems = Array.from({ length: Math.min(itemCount, 10) }, (_, i) => i);

  return (
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-2xl opacity-50"></div>

        <div className="relative p-4 md:p-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-40 bg-gradient-to-r from-muted/50 to-muted/30" />
              <div className="px-2 py-1 bg-primary/10 rounded-full">
                <Skeleton className="h-4 w-16 bg-gradient-to-r from-primary/20 to-primary/10" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20 bg-gradient-to-r from-muted/50 to-muted/30 rounded-md" />
              <Skeleton className="h-8 w-20 bg-gradient-to-r from-muted/50 to-muted/30 rounded-md" />
            </div>
          </div>

          {/* Filters Bar Skeleton */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Skeleton className="h-10 w-full bg-gradient-to-r from-muted/50 to-muted/30 rounded-md" />
              </div>
              
              {/* Filter dropdowns */}
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {[1, 2, 3, 4].map((_, index) => (
                  <Skeleton 
                    key={index}
                    className="h-10 w-28 bg-gradient-to-r from-muted/50 to-muted/30 rounded-md" 
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <Separator className="max-h-[0.5px] mb-6 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {/* Content Skeleton */}
          {viewMode === "cards" ? (
            <>
              {/* Cards Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {cardSkeletonItems.map((_, index) => (
                  <Card 
                    key={index}
                    className="p-4 space-y-4 bg-gradient-to-br from-card/50 to-card/30 border-muted/20 animate-pulse"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Player Avatar */}
                    <div className="flex items-center justify-center">
                      <Skeleton className="h-16 w-16 rounded-full bg-gradient-to-br from-muted/60 to-muted/40" />
                    </div>
                    
                    {/* Player Name */}
                    <div className="text-center space-y-2">
                      <Skeleton className="h-5 w-3/4 mx-auto bg-gradient-to-r from-muted/50 to-muted/30" />
                      <Skeleton className="h-4 w-1/2 mx-auto bg-gradient-to-r from-muted/40 to-muted/20" />
                    </div>
                    
                    {/* Player Info */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-12 bg-gradient-to-r from-muted/40 to-muted/20" />
                        <Skeleton className="h-4 w-16 bg-gradient-to-r from-muted/40 to-muted/20" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-16 bg-gradient-to-r from-muted/40 to-muted/20" />
                        <Skeleton className="h-4 w-20 bg-gradient-to-r from-muted/40 to-muted/20" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-14 bg-gradient-to-r from-muted/40 to-muted/20" />
                        <Skeleton className="h-4 w-18 bg-gradient-to-r from-muted/40 to-muted/20" />
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3">
                      <Skeleton className="h-8 flex-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-md" />
                      <Skeleton className="h-8 w-8 bg-gradient-to-r from-muted/40 to-muted/20 rounded-md" />
                      <Skeleton className="h-8 w-8 bg-gradient-to-r from-destructive/20 to-destructive/10 rounded-md" />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-muted/20">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24 bg-gradient-to-r from-muted/40 to-muted/20" />
                  <Skeleton className="h-8 w-16 bg-gradient-to-r from-muted/40 to-muted/20 rounded" />
                  <Skeleton className="h-4 w-16 bg-gradient-to-r from-muted/40 to-muted/20" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 bg-gradient-to-r from-muted/40 to-muted/20 rounded" />
                  <Skeleton className="h-8 w-8 bg-gradient-to-r from-primary/20 to-primary/10 rounded" />
                  <Skeleton className="h-8 w-8 bg-gradient-to-r from-muted/40 to-muted/20 rounded" />
                  <Skeleton className="h-8 w-8 bg-gradient-to-r from-muted/40 to-muted/20 rounded" />
                  <Skeleton className="h-8 w-8 bg-gradient-to-r from-muted/40 to-muted/20 rounded" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Table View Skeleton */}
              <Card className="border-muted/20">
                {/* Table Header */}
                <div className="p-4 border-b border-muted/20">
                  <div className="grid grid-cols-6 gap-4">
                    {['Player', 'Sport', 'Year Level', 'Course', 'Status', 'Actions'].map((_, index) => (
                      <Skeleton 
                        key={index}
                        className="h-4 bg-gradient-to-r from-muted/50 to-muted/30" 
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
                      <div className="grid grid-cols-6 gap-4 items-center">
                        {/* Player Column */}
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full bg-gradient-to-br from-muted/60 to-muted/40" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24 bg-gradient-to-r from-muted/50 to-muted/30" />
                            <Skeleton className="h-3 w-20 bg-gradient-to-r from-muted/40 to-muted/20" />
                          </div>
                        </div>
                        
                        {/* Other Columns */}
                        <Skeleton className="h-4 w-16 bg-gradient-to-r from-muted/40 to-muted/20" />
                        <Skeleton className="h-4 w-12 bg-gradient-to-r from-muted/40 to-muted/20" />
                        <Skeleton className="h-4 w-20 bg-gradient-to-r from-muted/40 to-muted/20" />
                        <Skeleton className="h-6 w-16 bg-gradient-to-r from-green-500/20 to-green-400/10 rounded-full" />
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8 bg-gradient-to-r from-muted/40 to-muted/20 rounded" />
                          <Skeleton className="h-8 w-8 bg-gradient-to-r from-muted/40 to-muted/20 rounded" />
                          <Skeleton className="h-8 w-8 bg-gradient-to-r from-destructive/20 to-destructive/10 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Table Pagination Skeleton */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32 bg-gradient-to-r from-muted/40 to-muted/20" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20 bg-gradient-to-r from-muted/40 to-muted/20 rounded" />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <Skeleton 
                        key={index}
                        className="h-8 w-8 bg-gradient-to-r from-muted/40 to-muted/20 rounded" 
                      />
                    ))}
                  </div>
                  <Skeleton className="h-8 w-20 bg-gradient-to-r from-muted/40 to-muted/20 rounded" />
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
  );
};

export default PlayersListSkeleton;
