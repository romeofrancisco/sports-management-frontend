import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Trophy,
  BarChart3,
  TrendingUp,
  Star,
  TrendingDown,
} from "lucide-react";
import {
  usePlayerProgressById,
  usePlayerRadarChart,
} from "@/hooks/useTrainings";
import PlayerProgressStatsSkeleton from "./PlayerProgressStatsSkeleton";
import { formatMetricValue } from "@/utils/formatters";

// Get last 90 days (3 months) as default date range - calculated once outside component
const getDefaultDateRange = () => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 90);

  return {
    date_from: from.toISOString().split("T")[0],
    date_to: to.toISOString().split("T")[0],
  };
};

const PlayerProgressStats = ({ playerId }) => {
  const dateRange = getDefaultDateRange();
  // Fetch player progress data with backend calculations
  const {
    data: playerData,
    isLoading,
    isError,
  } = usePlayerProgressById(playerId, !!playerId);

  // Fetch radar chart data for category-level information
  const {
    data: radarData,
    isLoading: isRadarLoading,
    isError: isRadarError,
  } = usePlayerRadarChart(playerId, dateRange, !!playerId);
  if (isLoading || isRadarLoading) {
    return <PlayerProgressStatsSkeleton />;
  }

  // If there's an error or the player has no metrics data at all
  if (
    isError ||
    !playerData ||
    (playerData.metrics_data && playerData.metrics_data.length === 0)
  ) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="relative overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-muted/5 to-background shadow-lg sm:col-span-2 lg:col-span-4">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/10 via-transparent to-muted/5" />
          <CardContent className="relative p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl shadow-inner">
                <BarChart3 className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">
                  No Training Data Available
                </h3>
                <p className="text-sm text-muted-foreground">
                  Start tracking progress by recording training sessions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } // Helper function to find the best category from radar chart data
  const getBestCategory = () => {
    if (!radarData?.categories || radarData.categories.length === 0) {
      return null;
    }

    // Find the category with the highest average_improvement
    let bestCategory = null;
    let highestImprovement = -Infinity;

    radarData.categories.forEach((category) => {
      if (
        category.average_improvement !== undefined &&
        category.average_improvement !== null
      ) {
        const improvement = parseFloat(category.average_improvement);
        if (improvement > highestImprovement) {
          highestImprovement = improvement;
          bestCategory = category;
        }
      }
    });

    return bestCategory;
  };

  const bestCategory = getBestCategory();

  const stats = [
    {
      title: "Recent Progress",
      value: playerData?.recent_improvement
        ? `${playerData.recent_improvement.is_positive ? "+" : ""}${parseFloat(
            playerData.recent_improvement.percentage
          ).toFixed(1)}%`
        : "--",
      description: "Last 3 months improvement",
      icon: <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />,
      color: "from-primary via-primary/90 to-primary/80",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
      textAccent: "text-primary",
    },
    {
      title: "Overall Progress",
      value: playerData?.overall_improvement
        ? `${playerData.overall_improvement.is_positive ? "+" : ""}${parseFloat(
            playerData.overall_improvement.percentage
          ).toFixed(1)}%`
        : "--",
      description: "Total improvement",
      icon: <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />,
      color: "from-secondary via-secondary/90 to-secondary/80",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      iconBg: "bg-secondary",
      textAccent: "text-secondary",
    },
    {
      title: "Best Performance",
      value: playerData?.best_performance
        ? formatMetricValue(
            playerData.best_performance.value,
            playerData.best_performance.unit
          )
        : "--",
      description: playerData?.best_performance?.metric_name || "No data recorded",
      icon: <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
      color: "from-orange-500 via-orange-500/90 to-orange-500/80",
      bgColor: "bg-orange-500/8",
      borderColor: "border-orange-500/30",
      iconBg: "bg-orange-500",
      textAccent: "text-orange-600",
      unit: playerData?.best_performance?.unit,
    },
    {
      title: "Best Category",
      value:
        bestCategory?.average_improvement !== undefined
          ? `+${parseFloat(bestCategory.average_improvement).toFixed(1)}%`
          : "--",
      description: bestCategory?.category_name || "No category data",
      icon: <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
      color: "from-red-500 via-red-500/90 to-red-500/80",
      bgColor: "bg-red-500/8",
      borderColor: "border-red-500/30",
      iconBg: "bg-red-500",
      textAccent: "text-red-600",
    },
  ];
  return (
    <div className="space-y-3 sm:space-y-4 mb-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              stat.bgColor || ""
            } ${stat.borderColor || ""} border`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                stat.color || ""
              } opacity-5`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`p-1.5 sm:p-2 rounded-lg ${
                  stat.iconBg || ""
                } shadow-lg transition-transform duration-300 hover:scale-110`}
              >
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className={`text-xl sm:text-2xl font-bold ${stat.textAccent || ""}`}>
                  {stat.value}
                </div>
                {stat.unit && (
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {stat.unit}
                  </span>
                )}
                {stat.badge}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlayerProgressStats;
