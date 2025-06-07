import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { usePlayerOverview, usePlayerProgress } from "@/api/dashboardApi";
import {
  User,
  Trophy,
  Calendar,
  TrendingUp,
  Target,
  Activity,
  Clock,
  Radar,
} from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import PlayerRadarChartContainer from "@/components/charts/PlayerRadarChart/PlayerRadarChartContainer";
import ProgressChartCard from "@/components/trainings/players/dashboard/ProgressChartCard";
import RadarChartCard from "@/components/trainings/players/dashboard/RadarChartCard";
import { TrainingAnalyticsChart } from "@/components/charts/TeamAnalyticsCharts/TrainingAnalyticsChart";
import { useSelector } from "react-redux";

const PlayerDashboard = () => {
  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
  } = usePlayerOverview();
  const {
    data: progress,
    isLoading: progressLoading,
    error: progressError,
  } = usePlayerProgress();
  const { user } = useSelector((state) => state.auth);

  // Calculate 3-month date range for faster loading
  const dateRange = useMemo(() => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    return {
      from: threeMonthsAgo.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    };
  }, []);

  if (overviewLoading || progressLoading) {
    return <DashboardSkeleton />;
  }

  if (overviewError || progressError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
        <div className="p-4 md:p-6">
          <div className="bg-destructive/15 border border-destructive/50 rounded-lg p-4">
            <h3 className="text-destructive font-semibold">
              Error Loading Dashboard
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {overviewError?.message ||
                progressError?.message ||
                "Failed to load dashboard data"}
            </p>
          </div>
        </div>
      </div>
    );
  }
  const personalStats = overview?.personal_stats;
  const teamInfo = overview?.team_info;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Header */}
        <UniversityPageHeader
          title={`Welcome ${user?.first_name || "Player"}!`}
          subtitle="Player Portal"
          description="Track your performance and upcoming activities"
          showOnlineStatus={true}
          showUniversityColors={true}
        />
        <div className="animate-in fade-in-50 duration-500 delay-100 space-y-6">
          {/* Player Info Card */}
          {personalStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Player Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-semibold">
                      {user?.first_name} {user?.last_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Team</div>
                    <div className="font-semibold">
                      {teamInfo?.name || "Not assigned"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Positions
                    </div>
                    <div className="font-semibold">
                      {personalStats.positions?.join(", ") || "Not assigned"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Jersey Number
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      #{personalStats.jersey_number || "N/A"}
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3 mt-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground">Height</div>
                    <div className="font-semibold">
                      {personalStats.height} cm
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Weight</div>
                    <div className="font-semibold">
                      {personalStats.weight} kg
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Sport</div>
                    <div className="font-semibold">
                      {teamInfo?.sport || "N/A"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Games
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview?.upcoming_games?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Games scheduled</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Training Sessions
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {personalStats?.total_sessions_last_30_days || 0}
                </div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Attendance Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {personalStats?.attendance_rate?.toFixed(1) || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Training attendance
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sessions Attended
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {personalStats?.attended_sessions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Out of {personalStats?.total_sessions_last_30_days || 0}
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Upcoming Games */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Games
              </CardTitle>
              <CardDescription>Your scheduled matches</CardDescription>
            </CardHeader>
            <CardContent>
              {overview?.upcoming_games?.length > 0 ? (
                <div className="space-y-3">
                  {overview.upcoming_games.slice(0, 5).map((game, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {game.is_home
                            ? `vs ${game.away_team}`
                            : `@ ${game.home_team}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(game.date).toLocaleDateString()} •
                          {game.location || "TBD"}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {game.is_home ? "Home" : "Away"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming games scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Recent Performance */}
          {overview?.recent_metrics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Recent Training Metrics
                </CardTitle>
                <CardDescription>
                  Your latest performance measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {overview.recent_metrics.slice(0, 6).map((metric, index) => (
                    <div
                      key={index}
                      className="text-center p-3 border rounded-lg"
                    >
                      <div className="text-lg font-bold">
                        {metric.value} {metric.unit}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {metric.metric_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(metric.session_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Personal Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Recent Personal Progress (Last 3 Months)
              </CardTitle>
              <CardDescription>
                Your training and development metrics trends over the past 90
                days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {progress?.metric_trends &&
              Object.keys(progress.metric_trends).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(progress.metric_trends)
                    .slice(0, 6)
                    .map(([metricName, metricData], index) => {
                      // Get only the latest metric value
                      const latestMetric = metricData[metricData.length - 1];
                      const currentValue = latestMetric?.value || 0;
                      const unit = latestMetric?.unit || "";

                      // Use backend-calculated improvement percentage
                      const improvementPercentage =
                        latestMetric?.improvement_percentage || 0;
                      const isImproving = improvementPercentage > 0;
                      const progressValue = Math.min(
                        100,
                        Math.abs(improvementPercentage)
                      );

                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{metricName}</span>
                            <span className="text-muted-foreground">
                              {currentValue} {unit}
                            </span>
                          </div>
                          <Progress
                            value={progressValue}
                            className={`h-2 ${isImproving ? "" : "opacity-60"}`}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Last 3 months improvement</span>
                            <span
                              className={
                                isImproving ? "text-green-600" : "text-red-600"
                              }
                            >
                              {isImproving ? "+" : ""}
                              {improvementPercentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No progress metrics available</p>
                  <p className="text-sm">
                    Complete training sessions to see your progress
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Progress Summary */}
          {progress?.progress_summary && (
            <Card>
              <CardHeader>
                <CardTitle>Progress Summary</CardTitle>
                <CardDescription>Overview of your development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {progress.progress_summary.total_metrics || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Metrics Tracked
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {progress.progress_summary.average_improvement?.toFixed(
                        1
                      ) || 0}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Improvement
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {progress.progress_summary.goals_achieved || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Goals Achieved
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Performance Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Progress Chart */}
            {user?.id && (
              <ProgressChartCard
                playerId={user.id}
                dateRange={dateRange}
                className="col-span-1"
              />
            )}
            {/* Radar Chart */}
            {user?.id && personalStats && (
              <RadarChartCard
                playerId={user.id}
                playerName={`${user?.first_name} ${user?.last_name}`}
                dateRange={dateRange}
                className="col-span-1"
              />
            )}
          </div>
          {/* Training Analytics */}
          {overview?.training_analytics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Training Analytics (Last 3 Months)
                </CardTitle>
                <CardDescription>
                  Your training session participation and attendance trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <TrainingAnalyticsChart
                    data={overview.training_analytics}
                    title="Your Training Progress"
                  />
                </div>
              </CardContent>
            </Card>
          )}
          {/* Performance Radar Overview */}
          {user?.id && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radar className="h-5 w-5" />
                  Skills Overview
                </CardTitle>
                <CardDescription>
                  Comprehensive view of your athletic performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <PlayerRadarChartContainer
                    playerId={user.id}
                    dateRange={dateRange}
                    showControls={false}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
    <div className="p-4 md:p-6 space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default PlayerDashboard;
