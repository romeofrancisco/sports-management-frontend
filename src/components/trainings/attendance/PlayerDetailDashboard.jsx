import React, { useState } from "react";
import {
  createAttendanceDistributionChart,
  distributionChartOptions,
  createPlayerTrendsChart,
  playerTrendsChartOptions,
  createPlayerTimelineChart,
  playerTimelineChartOptions,
} from "./components/chartConfigs";
import PlayerDetailHeader from "@/components/trainings/attendance/components/player/PlayerDetailHeader";
import PlayerStatsCards from "@/components/trainings/attendance/components/player/PlayerStatsCards";
import PlayerAttendanceCharts from "@/components/trainings/attendance/components/player/PlayerAttendanceCharts";
import PlayerRecentSessions from "@/components/trainings/attendance/components/player/PlayerRecentSessions";

const PlayerDetailDashboard = ({
  player,
  playerDetailData,
  playerDetailLoading,
  playerDetailError,
  onBack,
}) => {
  const [chartType, setChartType] = useState("summary"); // 'summary' or 'timeline'
  if (playerDetailLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading player details...
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            Analyzing attendance patterns
          </p>
        </div>
      </div>
    );
  }

  if (playerDetailError || !playerDetailData) {
    return (
      <Alert className="border-red-200 bg-red-50/80 dark:bg-red-950/50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          Failed to load player details. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const data = playerDetailData;

  // Attendance distribution chart
  const attendanceDistribution = createAttendanceDistributionChart(
    data.attendance_distribution
  );

  // Chart data for both summary and timeline views
  const summaryChartData = createPlayerTrendsChart(data.trends);
  const timelineChartData = createPlayerTimelineChart(data.trends);

  const currentChartData =
    chartType === "summary" ? summaryChartData : timelineChartData;
  const currentChartOptions =
    chartType === "summary"
      ? playerTrendsChartOptions
      : playerTimelineChartOptions;
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with back button */}
      <PlayerDetailHeader data={data} onBack={onBack} />
      {/* Overview Cards at the Top */}
      <PlayerStatsCards data={data} />
      {/* Main and Side Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Section: Charts Only */}
        <div className="lg:col-span-2 space-y-6">
          <PlayerAttendanceCharts
            attendanceDistribution={attendanceDistribution}
            distributionChartOptions={distributionChartOptions}
            currentChartData={currentChartData}
            currentChartOptions={currentChartOptions}
            chartType={chartType}
            setChartType={setChartType}
          />
        </div>
        {/* Side Section: Recent Sessions */}
        <div className="lg:col-span-1">
          <PlayerRecentSessions recentSessions={data.recent_sessions} />
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailDashboard;
