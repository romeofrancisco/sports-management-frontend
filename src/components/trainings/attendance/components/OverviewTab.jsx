import React, { useState } from "react";
import FiltersSection from "./FiltersSection";
import { useAllTeams } from "@/hooks/useTeams";
import {
  useAttendanceOverview,
  useAttendanceTrends,
} from "@/hooks/useAttendanceAnalytics";
import { format, subDays, parseISO } from "date-fns";
import { Doughnut, Bar } from "react-chartjs-2";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  Users,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Activity,
} from "lucide-react";
import {
  getAllTeamsAttendanceColumns,
  getPlayerAttendanceColumns,
} from "./AttendanceTrackerColumns";
import { Chart } from "chart.js";
import ChartCard from "@/components/charts/ChartCard";

const OverviewTab = () => {
  const navigate = useNavigate();
  
  // Local filter state
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 90),
    to: new Date(),
  });
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");

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

  // Build filters for trends with period parameter
  const trendsFilters = {
    ...filters,
    period: selectedPeriod,
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
      <div className="grid gap-6 lg:grid-cols-8">
        <ChartCard
          title="Attendance Distribution"
          description="Proportion of attendance statuses"
          icon={Users}
          className="col-span-3"
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
          className="col-span-5"
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

        <ChartCard
          title={
            isTeamSelected
              ? "Player Attendance Tracker"
              : "Team Attendance Tracker"
          }
          description={
            isTeamSelected
              ? "Detailed attendance status for each player"
              : "Overall attendance status for the team"
          }
          icon={BarChart3}
          className="col-span-8"
          hasData={shouldShowAttendanceTable}
        >
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
            ) : (
              <DataTable
                unlimited={true}
                columns={attendanceColumns}
                data={attendanceTableData}
              />
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default OverviewTab;
