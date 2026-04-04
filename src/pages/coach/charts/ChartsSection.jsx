import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import ChartCard from "@/components/charts/ChartCard";
import { dashboardService } from "@/api/dashboardApi";
import {
  generateTeamOverviewData,
  generateGamesStatusData,
  generatePlayerDevelopmentData,
} from "./chartDataGenerators";
import {
  baseChartOptions,
  createTeamOverviewChartOptions,
  createPlayerDevelopmentChartOptions,
} from "./chartOptions";
import useChartSummaryModal from "@/hooks/useChartSummaryModal";
import ChartSummaryModal from "@/components/charts/ChartSummaryModal";

/**
 * Charts section component containing all dashboard charts
 */
const ChartsSection = ({ overview, playerProgress }) => {
  const {
    isOpen,
    setIsOpen,
    title,
    summaryLines,
    analysis,
    error,
    isLoading,
    openSummary,
  } = useChartSummaryModal({
    fetchSummary: (chartType) => dashboardService.getCoachChartSummary(chartType),
  });

  // Generate chart data
  const teamOverviewData = generateTeamOverviewData(overview);
  const gamesStatusData = generateGamesStatusData(overview);
  const playerDevelopmentData = generatePlayerDevelopmentData(playerProgress);

  // Generate chart options
  const teamOverviewChartOptions = createTeamOverviewChartOptions(overview);
  const playerDevelopmentChartOptions =
    createPlayerDevelopmentChartOptions(playerProgress);

  const hasTeamPerformanceData = overview?.team_attendance?.length > 0;
  const hasCoachingActivityData =
    overview?.upcoming_games?.length > 0 ||
    overview?.recent_training_sessions?.length > 0;
  const hasPlayerDevelopmentData = playerProgress?.player_progress?.length > 0;

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Team Overview Chart */}
        <ChartCard
          title="Team Performance & Activity"
          description="Real-time team attendance metrics and performance indicators"
          hasData={hasTeamPerformanceData}
          emptyMessage="No team data available"
          height={300}
          className="col-span-3 lg:col-span-2"
          onClick={
            hasTeamPerformanceData
              ? () =>
                  openSummary({
                    chartType: "team_performance",
                    fallbackTitle: "Team Performance & Activity",
                  })
              : undefined
          }
        >
          <Bar data={teamOverviewData} options={teamOverviewChartOptions} />
        </ChartCard>
        {/* Games & Activities Overview */}

        <ChartCard
          title="Coaching Activity"
          description="Strategic overview of coaching responsibilities and workload distribution"
          hasData={hasCoachingActivityData}
          className="col-span-3 lg:col-span-1"
          emptyMessage="No coaching activities data available"
          height={300}
          onClick={
            hasCoachingActivityData
              ? () =>
                  openSummary({
                    chartType: "coaching_activity",
                    fallbackTitle: "Coaching Activity",
                  })
              : undefined
          }
        >
          <Doughnut data={gamesStatusData} options={baseChartOptions} />
        </ChartCard>
      </div>

      {/* Additional Charts Section */}
      <div>
        {/* Player Development Overview */}
        <ChartCard
          title="Player Development Analytics"
          description="Comprehensive player performance metrics and development insights"
          hasData={hasPlayerDevelopmentData}
          emptyMessage="No player development data available"
          height={300}
          onClick={
            hasPlayerDevelopmentData
              ? () =>
                  openSummary({
                    chartType: "player_development",
                    fallbackTitle: "Player Development Analytics",
                  })
              : undefined
          }
        >
          <Bar
            data={playerDevelopmentData}
            options={playerDevelopmentChartOptions}
          />
        </ChartCard>
      </div>

      <ChartSummaryModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        isLoading={isLoading}
        error={error}
        analysis={analysis}
        summaryLines={summaryLines}
      />
    </div>
  );
};

export default ChartsSection;
