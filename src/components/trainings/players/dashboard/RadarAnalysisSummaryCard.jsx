import React from "react";
import { PieChart, Star, TrendingUp, Activity } from "lucide-react";
import { usePlayerRadarChart } from "@/hooks/useTrainings";
import ChartCard from "@/components/charts/ChartCard";

const RadarAnalysisSummaryCard = ({ 
  playerId, 
  dateRange, 
  className = "",
  title = "Radar Analysis Summary",
  description = "Performance breakdown across skill categories",
}) => {
  const {
    data: radarData,
    isLoading,
    error,
  } = usePlayerRadarChart(playerId, dateRange, !!playerId);
  if (isLoading) {
    return (
      <ChartCard
        title={title}
        description={description}
        icon={PieChart}
        height={"full"}
        className={className}
      >
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </ChartCard>
    );
  }
  if (error || !radarData?.categories || radarData.categories.length === 0) {
    return (
      <ChartCard
        title={title}
        description={description}
        icon={PieChart}
        height={"full"}
        className={className}
        hasData={false}
        emptyMessage="Performance insights will appear when sufficient data is available"
      />
    );
  }

  // Find best and areas for improvement
  const categories = radarData.categories || [];
  const bestCategory = categories.reduce(
    (best, current) =>
      current.average_improvement > (best?.average_improvement || -Infinity)
        ? current
        : best,
    null
  );

  const needsImprovement = categories.reduce(
    (worst, current) =>
      current.average_improvement < (worst?.average_improvement || Infinity)
        ? current
        : worst,
    null
  );

  const averagePerformance =
    categories.length > 0
      ? categories.reduce((sum, cat) => sum + cat.performance_score, 0) /
        categories.length
      : 0;

  return (
    <ChartCard
      title={title}
      description={description}
      icon={PieChart}
      height={"full"}
      className={className}
    >
      <div className="space-y-4">
        {/* Best Performing Category */}
        {bestCategory && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-secondary/20 dark:to-secondary/10 rounded-lg border border-primary/20 dark:border-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-primary dark:text-secondary" />
              <span className="text-sm font-medium text-primary dark:text-secondary">
                Best Category
              </span>
            </div>
            <p className="text-xs text-primary/80 dark:text-secondary/70">
              <span className="font-semibold">
                {bestCategory.category_name} {" "}
              </span>
              with {bestCategory.average_improvement.toFixed(1)}% improvement
            </p>
          </div>
        )}
        {/* Overall Performance */}
        {categories.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-secondary/20 dark:to-secondary/10 rounded-lg border border-primary/20 dark:border-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary dark:text-secondary" />
              <span className="text-sm font-medium text-primary dark:text-secondary">
                Overall Performance
              </span>
            </div>
            <p className="text-xs text-primary/80 dark:text-secondary/70">
              Average score of {averagePerformance.toFixed(1)}/100 across{" "}
              {categories.length} categories
            </p>
          </div>
        )}
        {/* Improvement Area */}
        {needsImprovement && needsImprovement !== bestCategory && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-secondary/20 dark:to-secondary/10 rounded-lg border border-primary/20 dark:border-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary dark:text-secondary" />
              <span className="text-sm font-medium text-primary dark:text-secondary">
                Focus Area
              </span>
            </div>
            <p className="text-xs text-primary/80 dark:text-secondary/70">
              <span className="font-semibold">
                {needsImprovement.category_name} {" "}
              </span>
              needs attention with {" "}
              {needsImprovement.average_improvement.toFixed(1)}% change
            </p>
          </div>
        )}
        {/* Categories Summary */}
        {categories.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-secondary/20 dark:to-secondary/10 rounded-lg border border-primary/20 dark:border-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-4 h-4 text-primary dark:text-secondary" />
              <span className="text-sm font-medium text-primary dark:text-secondary">
                Coverage
              </span>
            </div>
            <p className="text-xs text-primary/80 dark:text-secondary/70">
              Tracking {categories.length} training categories with detailed
              metrics analysis
            </p>
          </div>
        )}
      </div>
    </ChartCard>
  );
};

export default RadarAnalysisSummaryCard;
