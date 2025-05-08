import React, { useState } from "react";
import { useSeasonTeamPerformance, useSeasons } from "@/hooks/useSeasons";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatCards from "@/components/common/StatCards";

// Import chart components and utilities
import { 
  PointsChart,
  WinsChart,
  StreakChart, 
  DifferentialChart
} from '@/components/charts/SeasonCharts';

import {
  sanitizeTeamPerformance,
  getPointsData,
  getWinsData,
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

const LeagueStatistics = ({ leagueId, latestSeasonId, sport }) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState(latestSeasonId);
  const { data: seasons, isLoading: isSeasonsLoading } = useSeasons(leagueId);
  const { data: teamPerformance, isLoading } = useSeasonTeamPerformance(leagueId, selectedSeasonId);
  const { isSetsScoring, isLoading: isSportLoading } = useSportScoringType(sport);
  
  if (isLoading || isSportLoading || isSeasonsLoading) return <Loading />;

  // Sanitize team performance data
  const sanitizedPerformance = sanitizeTeamPerformance(teamPerformance);

  // Prepare data for charts using utility functions
  const statsSummary = getStatsSummary(sanitizedPerformance, isSetsScoring);
  const pointsData = getPointsData(sanitizedPerformance, isSetsScoring);
  const winsData = getWinsData(sanitizedPerformance, isSetsScoring);
  const streakData = getStreakData(sanitizedPerformance, isSetsScoring);
  const differentialData = getDifferentialData(sanitizedPerformance, isSetsScoring);

  const availableSeasons = seasons?.results || [];

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Season Statistics</h2>
        
        <Select 
          value={selectedSeasonId} 
          onValueChange={setSelectedSeasonId}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Season" />
          </SelectTrigger>
          <SelectContent>
            {availableSeasons.map(season => (
              <SelectItem key={season.id} value={season.id}>
                {season.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCards 
          statsSummary={statsSummary} 
          isSetsScoring={isSetsScoring} 
        />
      </div>

      {/* Charts - first row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <PointsChart data={pointsData} isSetsScoring={isSetsScoring} />
        <WinsChart data={winsData} isSetsScoring={isSetsScoring} />
      </div>

      {/* Charts - second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StreakChart data={streakData} isSetsScoring={isSetsScoring} />
        <DifferentialChart data={differentialData} isSetsScoring={isSetsScoring} />
      </div>
    </Card>
  );
};

export default LeagueStatistics;