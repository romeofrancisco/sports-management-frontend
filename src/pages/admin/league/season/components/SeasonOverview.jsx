import React from "react";
import { useParams } from "react-router";
import { useSeasonTeamPerformance } from "@/hooks/useSeasons";
import { useSportScoringType } from "@/hooks/useSports";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/components/common/FullLoading";
import SeasonOverviewStats from "./SeasonOverviewStats";
import SeasonOverviewSidebar from "./SeasonOverviewSidebar";
import { SeasonChartsContainer } from "./charts";

const SeasonOverview = ({ seasonDetails, sport }) => {
  const { league, season } = useParams();
    
  // Fetch team performance data for charts
  const { data: teamPerformance, isLoading: isTeamDataLoading } = useSeasonTeamPerformance(league, season);
  const { isSetsScoring, isLoading: isSportLoading } = useSportScoringType(sport);

  const isLoading = isTeamDataLoading || isSportLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-2 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Skeleton for charts */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={`chart-${i}`} className="shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!seasonDetails) return null;  return (
    <div className="animate-in fade-in-50 duration-500">
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
        <div className="space-y-8">
          {/* Season Overview Stats */}
          <SeasonOverviewStats seasonDetails={seasonDetails} />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Primary Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Season Statistics Charts */}
              <div className="animate-in fade-in-50 duration-500 delay-200">
                <SeasonChartsContainer 
                  teamPerformance={teamPerformance}
                  isSetsScoring={isSetsScoring}
                />
              </div>
            </div>

            {/* Right Column - Secondary Content */}
            <SeasonOverviewSidebar leagueId={league} seasonId={season} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonOverview;
