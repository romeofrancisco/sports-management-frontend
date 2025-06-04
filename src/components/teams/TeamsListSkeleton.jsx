import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

/**
 * Teams List Skeleton component
 * Displays a skeleton that matches the TeamsContainer structure
 */
const TeamsListSkeleton = ({ viewMode = "cards", pageSize = 12 }) => {
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-2xl opacity-50"></div>

      <div className="relative p-4 md:p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <div className="px-2 py-2 bg-primary/10 rounded-full flex">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>

        {/* Filters Bar Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <Separator className="max-h-[0.5px] mb-6 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Content Skeleton based on view mode */}
        {viewMode === "cards" ? (
          <>
            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(pageSize)
                .fill(0)
                .map((_, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-xl group animate-in fade-in-50 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Team Logo Skeleton */}
                    <div className="relative h-32 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Skeleton className="h-16 w-16 rounded-lg" />
                    </div>

                    <CardContent className="p-4 space-y-4">
                      {/* Team Name and Division */}
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>

                      {/* Team Stats */}
                      <div className="grid grid-cols-2 gap-4 py-3 bg-muted/50 rounded-lg px-3">
                        <div className="text-center space-y-1">
                          <Skeleton className="h-6 w-8 mx-auto" />
                          <Skeleton className="h-3 w-12 mx-auto" />
                        </div>
                        <div className="text-center space-y-1">
                          <Skeleton className="h-6 w-8 mx-auto" />
                          <Skeleton className="h-3 w-16 mx-auto" />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20" />
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-9 w-9" />
                  ))}
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Table View Skeleton */}
            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-muted/50 border-b">
                <div className="grid grid-cols-6 gap-4 p-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>

              {/* Table Rows */}
              {Array(Math.min(pageSize, 10))
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="border-b last:border-b-0">
                    <div className="grid grid-cols-6 gap-4 p-4 items-center">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Table Pagination Skeleton */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-9 w-9" />
                  ))}
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default TeamsListSkeleton;
