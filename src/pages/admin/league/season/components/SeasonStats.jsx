import React from "react";
import { useSeasonTeamPerformance } from "@/hooks/useSeasons";
import { useSportScoringType } from "@/hooks/useSports";
import Loading from "@/components/common/FullLoading";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { PointsBasedStatsCards, SetsBasedStatsCards } from "./StatsCards";
import { SeasonCharts } from "./SeasonCharts";
import {
  sanitizeTeamPerformance,
  getPointsData,
  getStreakData,
  getDifferentialData,
  getStatsSummary
} from '@/components/charts/SeasonCharts/utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const SeasonStats = ({ seasonId, leagueId, sport }) => {
  const { data: teamPerformance, isLoading } = useSeasonTeamPerformance(leagueId, seasonId);
  const { isSetsScoring, isLoading: isSportLoading } = useSportScoringType(sport);
  
  if (isLoading || isSportLoading) return <Loading />;
  // Sanitize team performance data
  const sanitizedPerformance = sanitizeTeamPerformance(teamPerformance);

  // Prepare all the data using the utility functions
  const statsSummary = getStatsSummary(sanitizedPerformance, isSetsScoring);
  const pointsData = getPointsData(sanitizedPerformance, isSetsScoring);
  const streakData = getStreakData(sanitizedPerformance, isSetsScoring);
  const differentialData = getDifferentialData(sanitizedPerformance, isSetsScoring);



  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Season Statistics</h2>
      
      {/* Stats Cards Section */}      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {isSetsScoring ? (
          <SetsBasedStatsCards statsSummary={statsSummary} />
        ) : (
          <PointsBasedStatsCards statsSummary={statsSummary} />
        )}
      </div>

      {/* Charts Section */}
      <SeasonCharts 
        pointsData={pointsData}
        streakData={streakData}
        differentialData={differentialData}
        isSetsScoring={isSetsScoring}
      />
    </div>
  );
};