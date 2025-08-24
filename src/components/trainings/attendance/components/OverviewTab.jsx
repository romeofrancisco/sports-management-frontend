import React, { useState } from "react";
import FiltersSection from "./FiltersSection";
import { useAllTeams } from "@/hooks/useTeams";
import {
  useAttendanceOverview,
  useAttendanceTrends,
} from "@/hooks/useAttendanceAnalytics";
import { format, subDays, parseISO } from "date-fns";
import { Doughnut, Line } from "react-chartjs-2";
import OverviewCards from "./OverviewCards";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  createAttendanceDistributionChart,
  distributionChartOptions,
} from "./chartConfigs/attendanceDistributionChart";
import {
  createTrendsChart,
  trendsChartOptions,
  verticalLinePlugin,
} from "./chartConfigs/trendsChart";
import DataTable from "@/components/common/DataTable";
import { useAttendanceTracker } from "@/hooks/useAttendanceAnalytics";

import {
  CalendarDays,
  Users,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Activity,
} from "lucide-react";
import { getAllTeamsAttendanceColumns, getPlayerAttendanceColumns } from "./AttendanceTrackerColumns";

const OverviewTab = () => {
  // Local filter state
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 90),
    to: new Date(),
  });

  // Defensive fallback for dateRange
  const safeDateRange = {
    from: dateRange?.from || subDays(new Date(), 90),
    to: dateRange?.to || new Date(),
  };

  // Fetch teams
  const { data: teams = [], isLoading: teamsLoading } = useAllTeams();

  // Build filters
  const filters = {
    team_id: selectedTeam === "all" ? undefined : selectedTeam,
    start_date: safeDateRange.from
      ? format(safeDateRange.from, "yyyy-MM-dd")
      : undefined,
    end_date: safeDateRange.to
      ? format(safeDateRange.to, "yyyy-MM-dd")
      : undefined,
  };

  // Build filters for attendance tracker (includes team parameter for player data)
  const attendanceTrackerFilters = {
    team: selectedTeam === "all" ? undefined : selectedTeam,
    start_date: safeDateRange.from
      ? format(safeDateRange.from, "yyyy-MM-dd")
      : undefined,
    end_date: safeDateRange.to
      ? format(safeDateRange.to, "yyyy-MM-dd")
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
  } = useAttendanceTrends(filters);
  const {
    data: attendanceTracker,
    isLoading: attendanceTrackerLoading,
    error: attendanceTrackerError,
  } = useAttendanceTracker(attendanceTrackerFilters);

  // Determine which columns and data to use based on whether response contains player data
  const isTeamSelected = selectedTeam !== "all";
  const hasPlayerData = attendanceTracker?.[0]?.players && attendanceTracker[0].players.length > 0;
  
  const attendanceColumns = (isTeamSelected || hasPlayerData)
    ? getPlayerAttendanceColumns(attendanceTracker)
    : getAllTeamsAttendanceColumns(attendanceTracker);
  
  // Transform data for player view when team is selected or when response contains player data
  const attendanceTableData = (isTeamSelected || hasPlayerData) && attendanceTracker?.[0]?.players 
    ? attendanceTracker[0].players 
    : attendanceTracker;

  if (overviewLoading || trendsLoading || attendanceTrackerLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading attendance data...
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            Please wait while we process your analytics
          </p>
        </div>
      </div>
    );
  }
  if (overviewError || trendsError) {
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
  const attendanceDistribution = createAttendanceDistributionChart(
    overviewData.attendance_distribution
  );
  const trendsChartData = createTrendsChart(trendsData, (date) =>
    format(parseISO(date), "MMM dd")
  );

  // Overview stats cards data (styled like PlayerDetailDashboard)
  const overviewStats = [
    {
      title: "Total Sessions",
      value: overviewData.total_sessions || 0,
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
      value: overviewData.total_players || 0,
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
      value: `${overviewData.overall_attendance_rate || 0}%`,
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
      value: (overviewData.average_attendance_per_session || 0).toFixed(1),
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {overviewStats.map((stat, index) => (
          <OverviewCards key={index} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Attendance Distribution Chart */}
        <Card className="relative overflow-hidden col-span-2 border-2 border-primary/20">
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-lg bg-primary shadow-lg">
                <BarChart3 className="size-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Attendance Distribution
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Overall attendance patterns
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="h-80">
              {attendanceDistribution &&
              attendanceDistribution.datasets &&
              attendanceDistribution.datasets[0] &&
              attendanceDistribution.datasets[0].data &&
              attendanceDistribution.datasets[0].data.length > 0 &&
              attendanceDistribution.datasets[0].data.some((val) => val > 0) ? (
                <Doughnut
                  data={attendanceDistribution}
                  options={distributionChartOptions}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      No attendance distribution data available
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Check back once more attendance data is recorded
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Trends Chart */}
        <Card className="relative overflow-hidden col-span-3 border-2 border-primary/20">
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-lg bg-primary shadow-lg">
                <Activity className="size-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Attendance Trends
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Performance over time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="h-80">
              {trendsChartData ? (
                <Line
                  className="h-full w-full"
                  data={trendsChartData}
                  options={trendsChartOptions}
                  plugins={[verticalLinePlugin]}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      No trends data available
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Check back once more attendance data is recorded
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Tracker Table */}
        <Card className="relative overflow-hidden col-span-5 border-2 border-primary/20">
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-lg bg-primary shadow-lg">
                <BarChart3 className="size-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {isTeamSelected ? "Player Attendance Tracker" : "Team Attendance Tracker"}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {isTeamSelected 
                    ? "Individual player attendance by session" 
                    : "Daily attendance by team and session"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="overflow-x-auto">
              {attendanceTrackerLoading ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-2">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Loading attendance tracker...
                  </p>
                </div>
              ) : attendanceTrackerError ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-2">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    Failed to load attendance tracker data
                  </p>
                </div>
              ) : attendanceTableData &&
                attendanceTableData.length > 0 ? (
                <DataTable
                  unlimited={true}
                  columns={attendanceColumns}
                  data={attendanceTableData}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-40 space-y-2">
                  <BarChart3 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {isTeamSelected 
                      ? "No player attendance data available for selected team"
                      : "No attendance tracker data available"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
