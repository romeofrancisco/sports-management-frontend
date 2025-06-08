import React, { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PointsAnalysisChart,
  WinStreakChart,
  PerformanceDifferentialChart,
} from "./index";
import { prepareChartData } from "./utils";

/**
 * Container component for all season charts
 * @param {Array} teamPerformance - Team performance data
 * @param {boolean} isSetsScoring - Whether the sport uses sets scoring
 */
const SeasonChartsContainer = ({ teamPerformance, isSetsScoring }) => {
  // Process team performance data into chart-ready formats
  const { pointsData, streakData, differentialData } = useMemo(() => {
    return prepareChartData(teamPerformance, isSetsScoring);
  }, [teamPerformance, isSetsScoring]);
  // If no team performance data is available, show empty state
  if (!teamPerformance || teamPerformance.length === 0) {
    return (
      <Card className="group relative overflow-hidden border-2 border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-gradient-to-br backdrop-blur-sm animate-in fade-in-50 duration-500 delay-200">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-secondary/5 opacity-8"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl opacity-40"></div>

        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Season Analytics</h2>
          </div>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center relative z-10">
          <p className="text-muted-foreground">
            No team performance data available
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden animate-in fade-in-50 duration-500 delay-200">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Season Analytics
          </h2>
        </div>
        <p className="text-muted-foreground mt-2">
          Team performance and statistical insights
        </p>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Points Analysis and Win Streak Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <PerformanceDifferentialChart
            data={differentialData}
            isSetsScoring={isSetsScoring}
          />
          <WinStreakChart data={streakData} isSetsScoring={isSetsScoring} />
        </div>

        {/* Performance Differential Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PointsAnalysisChart
            data={pointsData}
            isSetsScoring={isSetsScoring}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonChartsContainer;
