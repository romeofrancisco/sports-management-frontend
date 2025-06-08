import React from "react";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import {
  PointsChart,
  StreakChart,
  DifferentialChart,
} from "@/components/charts/SeasonCharts";

/**
 * Component for displaying all season charts
 * @param {Object} pointsData - Data for points chart
 * @param {Object} streakData - Data for streak chart
 * @param {Object} differentialData - Data for differential chart
 * @param {boolean} isSetsScoring - Whether the sport uses sets scoring
 */
export const SeasonCharts = ({
  pointsData,
  streakData,
  differentialData,
  isSetsScoring,
}) => {
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden animate-in fade-in-50 duration-500 delay-200">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
              Season Analytics
            </h2>
            <CardDescription>
              Team performance and statistical insights
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <DifferentialChart
            data={differentialData}
            isSetsScoring={isSetsScoring}
            className="lg:col-span-3"
          />
          <StreakChart 
            data={streakData} 
            isSetsScoring={isSetsScoring}
            className="lg:col-span-2"
          />
        </div>

        <div className="grid grid-cols-1">
          <PointsChart data={pointsData} isSetsScoring={isSetsScoring} />
        </div>
      </CardContent>
    </Card>
  );
};
