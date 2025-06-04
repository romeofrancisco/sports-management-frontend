import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Star, TrendingUp, Activity } from "lucide-react";
import { usePlayerRadarChart } from "@/hooks/useTrainings";

const RadarAnalysisSummaryCard = ({ playerId, dateRange, className = "" }) => {
  const {
    data: radarData,
    isLoading,
    error,
  } = usePlayerRadarChart(playerId, dateRange, !!playerId);

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-secondary" />
            Radar Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (error || !radarData?.categories || radarData.categories.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-secondary" />
            Radar Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <PieChart className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  No Analysis Data
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Performance insights will appear when sufficient data is available
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find best and areas for improvement
  const categories = radarData.categories || [];
  const bestCategory = categories.reduce((best, current) => 
    current.average_improvement > (best?.average_improvement || -Infinity) ? current : best
  , null);
  
  const needsImprovement = categories.reduce((worst, current) => 
    current.average_improvement < (worst?.average_improvement || Infinity) ? current : worst
  , null);

  const averagePerformance = categories.length > 0 
    ? categories.reduce((sum, cat) => sum + cat.performance_score, 0) / categories.length 
    : 0;

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-secondary" />
          Radar Analysis Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Best Performing Category */}
          {bestCategory && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Best Category
                </span>
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                <span className="font-semibold">{bestCategory.category_name}</span> with{" "}
                {bestCategory.average_improvement.toFixed(1)}% improvement
              </p>
            </div>
          )}          {/* Overall Performance */}
          {categories.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Overall Performance
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Average score of {averagePerformance.toFixed(1)}/100 across {categories.length} categories
              </p>
            </div>
          )}

          {/* Improvement Area */}
          {needsImprovement && needsImprovement !== bestCategory && (
            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Focus Area
                </span>
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                <span className="font-semibold">{needsImprovement.category_name}</span> needs attention with{" "}
                {needsImprovement.average_improvement.toFixed(1)}% change
              </p>
            </div>
          )}          {/* Categories Summary */}
          {categories.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Coverage
                </span>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Tracking {categories.length} training categories with detailed metrics analysis
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RadarAnalysisSummaryCard;
