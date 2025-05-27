import React from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import ChartCard from "@/components/charts/ChartCard";
import {
  generateTeamOverviewData,
  generateGamesStatusData,
  generateTrainingProgressData,
  generatePlayerDevelopmentData,
} from "./chartDataGenerators";
import {
  baseChartOptions,
  createTeamOverviewChartOptions,
  createPlayerDevelopmentChartOptions,
  lineChartOptions,
} from "./chartOptions";

/**
 * Charts section component containing all dashboard charts
 */
const ChartsSection = ({ overview, playerProgress }) => {
  // Generate chart data
  const teamOverviewData = generateTeamOverviewData(overview);
  const gamesStatusData = generateGamesStatusData(overview);
  const trainingProgressData = generateTrainingProgressData(overview);
  const playerDevelopmentData = generatePlayerDevelopmentData(playerProgress);

  // Generate chart options
  const teamOverviewChartOptions = createTeamOverviewChartOptions(overview);
  const playerDevelopmentChartOptions = createPlayerDevelopmentChartOptions(playerProgress);
  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">        {/* Team Overview Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <ChartCard
            title="Team Performance & Activity"
            hasData={overview?.team_attendance?.length > 0}
            emptyMessage="No team data available"
            height={300}
          >
            <Bar data={teamOverviewData} options={teamOverviewChartOptions} />
          </ChartCard>
        </div>        {/* Games & Activities Overview */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <ChartCard
            title="Coaching Activity Overview"
            hasData={overview?.upcoming_games?.length > 0 || overview?.recent_training_sessions?.length > 0}
            emptyMessage="No coaching activities data available"
            height={300}
          >
            <Doughnut data={gamesStatusData} options={baseChartOptions} />
          </ChartCard>
        </div>
      </div>

      {/* Additional Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">        {/* Training Progress Trend */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <ChartCard
            title="Training Session Engagement"
            hasData={overview?.recent_training_sessions?.length > 0}
            emptyMessage="No training sessions data available"
            height={300}
          >
            <Line data={trainingProgressData} options={lineChartOptions} />
          </ChartCard>
        </div>        {/* Player Development Overview */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <ChartCard
            title="Player Development Analytics"
            hasData={playerProgress?.player_progress?.length > 0}
            emptyMessage="No player development data available"
            height={300}
          >
            <Bar data={playerDevelopmentData} options={playerDevelopmentChartOptions} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
