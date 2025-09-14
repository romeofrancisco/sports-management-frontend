import React from "react";
import {
  createAttendanceDistributionChart,
  distributionChartOptions,
} from "./components/chartConfigs/attendanceDistributionChart";
import {
  createPlayerMonthlyTrendChart,
  playerMonthlyTrendChartOptions,
} from "./components/chartConfigs/playerMonthlyTrendChart";
import PlayerStatsCards from "@/components/trainings/attendance/components/player/PlayerStatsCards";
import PlayerInfoAndSessions from "@/components/trainings/attendance/components/player/PlayerInfoAndSessions";
import { AlertCircle } from "lucide-react";
import ChartCard from "@/components/charts/ChartCard";
import { Doughnut, Line } from "react-chartjs-2";
import { BarChart3, TrendingUp } from "lucide-react";

const PlayerDetailDashboard = ({
  player,
  playerDetailData,
  playerDetailLoading,
  playerDetailError,
  onBack,
}) => {
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

  // Monthly trend chart data
  const monthlyTrendData = createPlayerMonthlyTrendChart(data.trends);
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Overview Cards at the Top */}
      <PlayerStatsCards data={data} />
      {/* Main and Side Section Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-8 gap-6">
        {/* Side Section: Combined Player Info and Recent Sessions */}
        <div className="lg:col-span-2">
          <PlayerInfoAndSessions
            data={data}
            onBack={onBack}
            recentSessions={data.recent_sessions}
          />
        </div>
        <ChartCard
          title="Attendance Distribution"
          description="Overall attendance breakdown"
          icon={BarChart3}
          hasData={attendanceDistribution}
          className="md:col-span-2"
        >
          <Doughnut
            data={attendanceDistribution}
            options={distributionChartOptions}
          />
        </ChartCard>
        <ChartCard
          title="Monthly Progress"
          description="Attendance trends over time"
          icon={TrendingUp}
          hasData={monthlyTrendData}
          className="md:col-span-4"
        >
          <Line
            data={monthlyTrendData}
            options={playerMonthlyTrendChartOptions}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default PlayerDetailDashboard;
