import React from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLeagueComprehensiveStats } from "@/hooks/useLeagues";
import Loading from "@/components/common/FullLoading";
import {
  PerformanceComparisonChart,
  WinDistributionChart,
  ScoringAnalysisChart,
} from "./index";

const LeagueCharts = ({ leagueId, sport, className = "" }) => {
  const { data: stats, isLoading } = useLeagueComprehensiveStats(leagueId);

  const isSetBased = stats?.scoring_type === "sets"; // Determine if the sport is set-based (like volleyball) or point-based (like basketball)

  if (isLoading) return <Loading />;
  if (!stats) return <div>No statistics available</div>;
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PerformanceComparisonChart
          className="lg:col-span-2"
          teams={stats.teams}
          isSetBased={isSetBased}
        />
        <WinDistributionChart teams={stats.teams} isSetBased={isSetBased} />
      </div>

      {/* Scoring Analysis Chart Row */}
      <div className="grid grid-cols-1 gap-6">
        <ScoringAnalysisChart teams={stats.teams} isSetBased={isSetBased} />
      </div>
    </>
  );
};

export default LeagueCharts;
