import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import FiltersSection from "@/components/trainings/attendance/components/FiltersSection";
import { useAllTeams } from "@/hooks/useTeams";
import {
  useAttendanceOverview,
  useAttendanceTrends,
} from "@/hooks/useAttendanceAnalytics";
import { format, subDays } from "date-fns";
import { Doughnut, Bar } from "react-chartjs-2";
import OverviewCards from "@/components/trainings/attendance/components/OverviewCards";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createAttendanceDistributionChart,
  distributionChartOptions,
} from "@/components/trainings/attendance/components/chartConfigs/attendanceDistributionChart";
import {
  createTrendsChart,
  trendsChartOptions,
} from "@/components/trainings/attendance/components/chartConfigs/trendsChart";
import DataTable from "@/components/common/DataTable";
import { useAttendanceTracker } from "@/hooks/useAttendanceAnalytics";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Users,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Activity,
  ExternalLink,
} from "lucide-react";
import {
  getAllTeamsAttendanceColumns,
  getPlayerAttendanceColumns,
} from "@/components/trainings/attendance/components/AttendanceTrackerColumns";
import ChartCard from "@/components/charts/ChartCard";
import { ScrollArea } from "@/components/ui/scroll-area";

const AttendanceAnalyticsPage = () => {
  const navigate = useNavigate();
  
  // Local filter state
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 90),
    to: new Date(),
  });
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");

  // Fetch teams
  const { data: teams = [], isLoading: teamsLoading } = useAllTeams();

  // Build filters
  const filters = {
    team_id: selectedTeam === "all" ? undefined : selectedTeam,
    start_date: dateRange.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    end_date: dateRange.to
      ? format(dateRange.to, "yyyy-MM-dd")
      : undefined,
  };

  // Build filters for trends with period parameter
  const trendsFilters = {
    ...filters,
    period: selectedPeriod,
  };

  // Build filters for attendance tracker (includes team parameter for player data)
  const attendanceTrackerFilters = {
    team: selectedTeam === "all" ? undefined : selectedTeam,
    start_date: dateRange.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    end_date: dateRange.to
      ? format(dateRange.to, "yyyy-MM-dd")
      : undefined,
  };

  // Fetch analytics
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
  } = useAttendanceOverview(filters);

  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
  } = useAttendanceTrends(trendsFilters);

  const {
    data: attendanceTracker,
    isLoading: attendanceTrackerLoading,
    error: attendanceTrackerError,
  } = useAttendanceTracker(attendanceTrackerFilters);

  // Determine which columns and data to use based on whether response contains player data
  const isTeamSelected = selectedTeam !== "all";
  const hasPlayerData =
    attendanceTracker?.[0]?.players && attendanceTracker[0].players.length > 0;

  // Check if there's actual attendance data (not just empty objects)
  const hasAttendanceData = () => {
    if (!attendanceTracker || attendanceTracker.length === 0) return false;

    if (hasPlayerData) {
      // For player data, check if any player has attendance records
      const players = attendanceTracker[0].players;
      return players.some(
        (player) =>
          player.attendance && Object.keys(player.attendance).length > 0
      );
    } else {
      // For team data, check if any team has attendance records
      return attendanceTracker.some(
        (team) => team.attendance && Object.keys(team.attendance).length > 0
      );
    }
  };

  const shouldShowAttendanceTable = hasAttendanceData();

  const attendanceColumns =
    isTeamSelected || hasPlayerData
      ? getPlayerAttendanceColumns(attendanceTracker, navigate)
      : getAllTeamsAttendanceColumns(attendanceTracker);

  // Transform data for player view when team is selected or when response contains player data
  const attendanceTableData =
    (isTeamSelected || hasPlayerData) && attendanceTracker?.[0]?.players
      ? attendanceTracker[0].players
      : attendanceTracker;

  // Combined loading state
  const isLoading =
    overviewLoading || trendsLoading || attendanceTrackerLoading;

  // Combined error state
  const hasError = overviewError || trendsError;

  // Skeleton component for loading states
  const AttendanceAnalyticsSkeleton = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="p-6 h-40 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-8">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-8">
        {/* Attendance Distribution Chart Skeleton */}
        <div className="xl:col-span-2 lg:col-span-3 p-6 rounded-xl border bg-card">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Skeleton className="h-48 w-48 rounded-full" />
            </div>
          </div>
        </div>

        {/* Trends Chart Skeleton */}
        <div className="xl:col-span-6 lg:col-span-5 p-6 rounded-xl border bg-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
            <div className="h-80">
              <div className="flex items-end justify-between h-full space-x-2 px-4">
                {[...Array(8)].map((_, index) => (
                  <Skeleton 
                    key={index} 
                    className="w-full rounded-t-sm" 
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Tracker Table Skeleton */}
        <div className="col-span-8 p-6 rounded-xl border bg-card">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
            <div className="space-y-3">
              {/* Table header */}
              <div className="flex gap-4 pb-2 border-b">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              {/* Table rows */}
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex gap-4 py-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (hasError) {
      return (
        <Alert className="border-red-200 bg-red-50/80 dark:bg-red-950/50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {overviewError?.message ||
              trendsError?.message ||
              "Failed to load attendance analytics data"}
          </AlertDescription>
        </Alert>
      );
    }

    if (isLoading) {
      return <AttendanceAnalyticsSkeleton />;
    }

    if (!overviewData || !overviewData.attendance_distribution) {
      return (
        <Alert className="border-amber-200 bg-amber-50/80 dark:bg-amber-950/50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            No attendance data available for the selected filters.
          </AlertDescription>
        </Alert>
      );
    }

    // Render actual content when data is loaded
    const attendanceDistribution = createAttendanceDistributionChart(
      overviewData.attendance_distribution
    );
    const trendsChartData = createTrendsChart(trendsData);

    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {overviewStats.map((stat, index) => (
            <OverviewCards key={index} {...stat} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-8">
          <ChartCard
            title="Attendance Distribution"
            description="Proportion of attendance statuses"
            icon={Users}
            className="xl:col-span-2 lg:col-span-3"
            hasData={attendanceDistribution?.datasets?.[0]?.data?.some(
              (val) => val > 0
            )}
          >
            <div className="h-80 flex items-center justify-center">
              <Doughnut
                data={attendanceDistribution}
                options={distributionChartOptions}
              />
            </div>
          </ChartCard>

          <ChartCard
            title={getChartTitle()}
            description={getChartDescription()}
            icon={TrendingUp}
            className="xl:col-span-6 lg:col-span-5"
            action={<PeriodToggle />}
            hasData={trendsChartData}
          >
            <Bar
              className="h-full w-full"
              data={trendsChartData}
              options={trendsChartOptions}
            />
          </ChartCard>

          {/* Attendance Tracker Table - Only show if there's actual attendance data */}
          {shouldShowAttendanceTable && (
            <Card className="relative overflow-hidden col-span-8 border-2 border-primary/20">
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-lg bg-primary shadow-lg">
                    <BarChart3 className="size-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gradient text-xl">
                      {isTeamSelected
                        ? "Player Attendance Tracker"
                        : "Team Attendance Tracker"}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {isTeamSelected
                        ? "Detailed attendance status for each player"
                        : "Overall attendance status for the team"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-0">
                <div className="overflow-x-auto w-full">
                  {attendanceTrackerLoading ? (
                    <div className="p-6 space-y-3">
                      {/* Table header skeleton */}
                      <div className="flex gap-4 pb-2 border-b">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      {/* Table rows skeleton */}
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex gap-4 py-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : attendanceTrackerError ? (
                    <div className="flex flex-col items-center justify-center h-40 space-y-2">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        Failed to load attendance tracker data
                      </p>
                    </div>
                  ) : (
                    <DataTable
                      unlimited={true}
                      columns={attendanceColumns}
                      data={attendanceTableData}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const attendanceDistribution = createAttendanceDistributionChart(
    overviewData?.attendance_distribution
  );
  const trendsChartData = createTrendsChart(trendsData);

  // Period toggle component for the trends chart
  const PeriodToggle = () => (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
      <Button
        variant={selectedPeriod === "monthly" ? "default" : "ghost"}
        size="sm"
        onClick={() => setSelectedPeriod("monthly")}
        className="h-8 px-3 text-xs font-medium"
      >
        Monthly
      </Button>
      <Button
        variant={selectedPeriod === "weekly" ? "default" : "ghost"}
        size="sm"
        onClick={() => setSelectedPeriod("weekly")}
        className="h-8 px-3 text-xs font-medium"
      >
        Weekly
      </Button>
    </div>
  );

  // Dynamic chart title and description based on period
  const getChartTitle = () => {
    return selectedPeriod === "monthly"
      ? "Training Sessions Trends"
      : "Weekly Training Sessions";
  };

  const getChartDescription = () => {
    return selectedPeriod === "monthly"
      ? "Number of training sessions per month"
      : "Number of training sessions per week";
  };

  // Overview stats cards data - with safe data access
  const overviewStats = [
    {
      title: "Total Sessions",
      value: overviewData?.total_sessions || 0,
      description: "Training sessions recorded",
      icon: <CalendarDays className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary via-primary/90 to-primary/80",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
      textAccent: "text-primary",
    },
    {
      title: "Total Players",
      value: overviewData?.total_players || 0,
      description: "Unique participants",
      icon: <Users className="h-5 w-5 text-secondary-foreground" />,
      color: "from-secondary via-secondary/90 to-secondary/80",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      iconBg: "bg-secondary",
      textAccent: "text-secondary",
    },
    {
      title: "Attendance Rate",
      value: `${overviewData?.overall_attendance_rate || 0}%`,
      description: "Overall performance",
      icon: <BarChart3 className="h-5 w-5 text-primary-foreground" />,
      color: "from-green-500 via-green-500/90 to-green-500/80",
      bgColor: "bg-green-500/8",
      borderColor: "border-green-500/30",
      iconBg: "bg-green-500",
      textAccent: "text-green-600",
    },
    {
      title: "Avg Per Session",
      value: (overviewData?.average_attendance_per_session || 0).toFixed(2),
      description: "Players per session",
      icon: <TrendingUp className="h-5 w-5 text-primary-foreground" />,
      color: "from-orange-500 via-orange-500/90 to-orange-500/80",
      bgColor: "bg-orange-500/8",
      borderColor: "border-orange-500/30",
      iconBg: "bg-orange-500",
      textAccent: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="container mx-auto p-1 md:p-6 space-y-6">
        <UniversityPageHeader
          title="Attendance Analytics"
          subtitle="Training Management"
          description="View detailed attendance reports and analytics"
          showUniversityColors={true}
          showBackButton={true}
          backButtonText="Back to Training"
          backButtonPath="/trainings"
        />

        <div className="space-y-6 sm:space-y-8">
          {/* Header Section - Always visible */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                    <Activity className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                    Attendance Overview
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    Analyze training attendance patterns and player stats
                  </p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <FiltersSection
                  selectedTeam={selectedTeam}
                  onTeamChange={setSelectedTeam}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  teams={teams}
                  teamsLoading={teamsLoading}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalyticsPage;
