import React from "react";
import {
  useLeagueStatistics,
  useLeagueComprehensiveStats,
  useLeagueRankings,
} from "@/hooks/useLeagues";
import { useSportScoringType } from "@/hooks/useSports";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import LeagueOverviewStats from "./LeagueOverviewStats";
import TeamPerformanceStats from "./TeamPerformanceStats";
import GameHighlights from "../statistics/GameHighlights";
import LeagueOverviewSidebar from "./LeagueOverviewSidebar";
import { LeagueCharts } from "../charts";
import LeagueStandingsSection from "../standings/LeagueStandingsSection";

const LeagueOverview = ({ league, sport }) => {
  const { data: statistics, isLoading: statsLoading } =
    useLeagueStatistics(league);
  const { data: comprehensiveStats, isLoading: compStatsLoading } =
    useLeagueComprehensiveStats(league);
  const { data: rankings, isLoading: rankingsLoading } =
    useLeagueRankings(league);
  const { isSetsScoring, isLoading: isSportLoading } =
    useSportScoringType(sport);

  const isLoading =
    statsLoading || compStatsLoading || rankingsLoading || isSportLoading;

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

        {/* Skeleton for game highlights */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={`highlight-${i}`} className="shadow-sm">
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

  if (!statistics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="space-y-8">
        {/* League Overview Stats */}
        <LeagueOverviewStats statistics={statistics} />
        {/* Team Performance Stats */}
        <TeamPerformanceStats
          comprehensiveStats={comprehensiveStats}
          statistics={statistics}
        />
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Primary Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* League Standings Section */}
            <LeagueStandingsSection league={league} />
            {/* League Statistics Charts */}
            <LeagueCharts leagueId={league} sport={sport} />
            {/* Game Highlights section */}
            <GameHighlights comprehensiveStats={comprehensiveStats} />
          </div>

          {/* Right Column - Secondary Content */}
          <LeagueOverviewSidebar league={league} rankings={rankings} />
        </div>
      </div>
    </div>
  );
};

export default LeagueOverview;
