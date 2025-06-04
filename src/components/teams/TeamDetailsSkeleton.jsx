import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Team Details Skeleton component
 * Displays a skeleton that matches the TeamDetails page structure
 */
const TeamDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      {/* Team Header Skeleton */}
      <section className="p-4 md:p-6">
        <Card className="bg-gradient-to-r from-card via-secondary/8 to-primary/8 border-2 border-primary/20">
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                <Skeleton className="h-12 w-12 md:h-16 md:w-16 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48 md:w-64" />
                  <Skeleton className="h-4 w-64 md:w-80" />
                </div>
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Quick Stats Cards Skeleton */}
      <section className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-2 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="p-4 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Primary Content Skeleton */}
          <div className="xl:col-span-2 space-y-6">
            {/* Team Key Metrics Skeleton */}
            <Card className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center space-y-2">
                      <Skeleton className="h-12 w-12 rounded-lg mx-auto" />
                      <Skeleton className="h-8 w-16 mx-auto" />
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Charts Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Performance Chart Skeleton */}
              <div className="col-span-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-80 w-full rounded-lg" />
                  </CardContent>
                </Card>
              </div>

              {/* Stats Breakdown Skeleton */}
              <Card className="shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-80 w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>

            {/* Training Analytics Skeleton */}
            <Card className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full rounded-lg" />
              </CardContent>
            </Card>

            {/* Player Progress Skeleton */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Player Progress Table Skeleton */}
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-6 gap-4 pb-4 border-b">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                  
                  {/* Table Rows */}
                  {[1, 2, 3, 4, 5].map((row) => (
                    <div key={row} className="grid grid-cols-6 gap-4 py-3">
                      {[1, 2, 3, 4, 5, 6].map((col) => (
                        <Skeleton key={col} className="h-4 w-full" />
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions Skeleton */}
            <Card className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Games Skeleton */}
            <Card className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Games Skeleton */}
            <Card className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-28" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Training Skeleton */}
            <Card className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Training Skeleton */}
            <Card className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamDetailsSkeleton;
