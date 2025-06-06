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
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

      <CardHeader className="relative">
        <div className="flex items-center gap-3">          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
            League Analytics
          </h2>
        </div>
        <p className="text-muted-foreground mt-2">
          Performance insights and statistical analysis
        </p>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Performance and Distribution Charts Row */}
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
      </CardContent>
    </Card>
  );
};

export default LeagueCharts;
