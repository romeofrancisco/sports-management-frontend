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
  const playerDevelopmentChartOptions =
    createPlayerDevelopmentChartOptions(playerProgress);
    
  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Team Overview Chart */}
        <ChartCard
          title="Team Performance & Activity"
          description="Real-time team attendance metrics and performance indicators"
          hasData={overview?.team_attendance?.length > 0}
          emptyMessage="No team data available"
          height={300}
          className="col-span-3 lg:col-span-2"
        >
          <Bar data={teamOverviewData} options={teamOverviewChartOptions} />
        </ChartCard>
        {/* Games & Activities Overview */}

        <ChartCard
          title="Coaching Activity"
          description="Strategic overview of coaching responsibilities and workload distribution"
          hasData={
            overview?.upcoming_games?.length > 0 ||
            overview?.recent_training_sessions?.length > 0
          }
          className="col-span-3 lg:col-span-1"
          emptyMessage="No coaching activities data available"
          height={300}
        >
          <Doughnut data={gamesStatusData} options={baseChartOptions} />
        </ChartCard>
      </div>

      {/* Additional Charts Section */}
      <div>
        {/* Training Progress Trend
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <ChartCard
            title="Training Session Engagement"
            hasData={overview?.recent_training_sessions?.length > 0}
            emptyMessage="No training sessions data available"
            height={300}
          >
            <Line data={trainingProgressData} options={lineChartOptions} />
          </ChartCard>
        </div> */}
        {/* Player Development Overview */}
        <ChartCard
          title="Player Development Analytics"
          description="Comprehensive player performance metrics and development insights"
          hasData={playerProgress?.player_progress?.length > 0}
          emptyMessage="No player development data available"
          height={300}
        >
          <Bar
            data={playerDevelopmentData}
            options={playerDevelopmentChartOptions}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default ChartsSection;
