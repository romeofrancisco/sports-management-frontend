import React, { useEffect } from "react";
import StatCard from "@/components/common/StatCard";
import {
  useLeagueStatistics,
  useLeagueComprehensiveStats,
  useLeagueRankings,
} from "@/hooks/useLeagues";
import { useSeasons } from "@/hooks/useSeasons";
import {
  Trophy,
  Users,
  Calendar,
  Goal,
  Award,
  Flag,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/components/common/DataTable";
import {
  highestScoringColumns,
  biggestMarginColumns,
} from "@/components/table_columns/GameHighlightsColumns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LeagueTeamsGrid from "./LeagueTeamsGrid";

const LeagueOverview = ({ league, sport, onTabChange }) => {
  const { data: statistics, isLoading: statsLoading } =
    useLeagueStatistics(league);
  const { data: comprehensiveStats, isLoading: compStatsLoading } =
    useLeagueComprehensiveStats(league);
  const { data: seasonsData, isLoading: seasonsLoading } = useSeasons(league);
  const { data: rankings, isLoading: rankingsLoading } =
    useLeagueRankings(league);

  const isLoading =
    statsLoading || compStatsLoading || seasonsLoading || rankingsLoading;

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
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </CardHeader>
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

  const {
    teams_count,
    seasons_count,
    active_seasons,
    games_count,
    current_season,
  } = statistics;

  // Check if we're dealing with a set-based sport (volleyball) or point-based sport (basketball)
  const isSetBased = comprehensiveStats?.scoring_type === "sets";

  // Extract top teams data if available
  const topTeams = comprehensiveStats?.top_teams || [];

  // Extract active seasons from the seasons data
  const activeSeasonsList =
    seasonsData?.results
      ?.filter((s) => s.status === "ongoing" || s.status === "upcoming")
      .slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* League Overview Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">League Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Teams"
            value={teams_count}
            icon={<Users size={20} className="text-blue-500" />}
            className="hover:shadow-md transition-all duration-300"
          />
          <StatCard
            title="Total Seasons"
            value={seasons_count}
            icon={
              <Flag size={20} className="text-green-500 dark:text-green-400" />
            }
            description={`${active_seasons} active`}
            className="hover:shadow-md transition-all duration-300"
          />
          <StatCard
            title="Total Games"
            value={games_count}
            icon={<Goal size={20} className="text-amber-500" />}
            className="hover:shadow-md transition-all duration-300"
          />
          <StatCard
            title="Current Season"
            value={
              current_season
                ? current_season.name || current_season.year
                : "None"
            }
            icon={<Calendar size={20} className="text-purple-500" />}
            description={
              current_season ? (
                <Badge
                  variant="outline"
                  className={`${
                    current_season.status === "ongoing"
                      ? "bg-green-50 text-green-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {current_season.status}
                </Badge>
              ) : (
                "No active season"
              )
            }
            className="hover:shadow-md transition-all duration-300"
          />
        </div>
      </div>

      {/* Game Highlights section - only show for point-based sports */}
      {comprehensiveStats && !isSetBased && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Game Highlights</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Highest Scoring Games */}
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-base flex items-center">
                  <Trophy className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-2" />
                  Highest Scoring Games
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Games with the most total points scored
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={highestScoringColumns}
                  data={comprehensiveStats.highest_scoring_games || []}
                  showPagination={false}
                  defaultPageSize={5}
                  className="text-xs"
                  size="sm"
                />
              </CardContent>
            </Card>

            {/* Biggest Margins of Victory */}
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-base flex items-center">
                  <Award className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                  Biggest Margins of Victory
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Games with the largest point differentials
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={biggestMarginColumns}
                  data={comprehensiveStats.biggest_margin_games || []}
                  showPagination={false}
                  defaultPageSize={5}
                  className="text-xs"
                  size="sm"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Teams Section */}
        {rankings && rankings.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Top Teams</h3>
                <p className="text-sm text-muted-foreground">
                  Current league standings showing the top performing teams
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange && onTabChange("leaderboard")}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center"
              >
                View Full Leaderboard <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <LeagueTeamsGrid
              teams={rankings.slice(0, 4)}
              className="md:grid-cols-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueOverview;
