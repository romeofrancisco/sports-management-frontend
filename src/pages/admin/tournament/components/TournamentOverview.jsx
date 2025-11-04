import React, { useMemo } from "react";
import { useTournamentStatistics } from "@/hooks/useTournaments";
import { useSportScoringType } from "@/hooks/useSports";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import TournamentOverviewStats from "./TournamentOverviewStats";
import TournamentOverviewSidebar from "./TournamentOverviewSidebar";
import TournamentCharts from "./TournamentCharts";
import { prepareTournamentChartData } from "./charts/utils";

const TournamentOverview = ({ tournament, standings }) => {
  const { data: statistics, isLoading: statsLoading } = useTournamentStatistics(
    tournament.id
  );
  const { isSetsScoring, isLoading: isSportLoading } = useSportScoringType(
    tournament.sport?.slug
  );

  // Prepare chart data using standings data (which contains team performance)
  const { pointsData, streakData, differentialData } = useMemo(() => {
    return prepareTournamentChartData(standings, isSetsScoring);
  }, [standings, isSetsScoring]);

  const isLoading = statsLoading || isSportLoading;

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

  if (!tournament) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
        <div className="space-y-8">
          {/* Tournament Overview Stats */}
          <TournamentOverviewStats tournament={tournament} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Primary Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Tournament Statistics Charts */}
              <div className="animate-in fade-in-50 duration-500 delay-200">
                <TournamentCharts
                  pointsData={pointsData}
                  streakData={streakData}
                  differentialData={differentialData}
                  isSetsScoring={isSetsScoring}
                />
              </div>
            </div>
            {/* Right Column - Secondary Content */}
            <TournamentOverviewSidebar
              tournamentId={tournament.id}
              standings={standings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentOverview;
