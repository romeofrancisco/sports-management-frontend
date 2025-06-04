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

// Get last 30 days as default date range - calculated once outside component
const getDefaultDateRange = () => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);

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
      description: "Last 30 days improvement",
      icon: <Activity className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary via-primary/90 to-primary/80",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
      textAccent: playerData?.recent_improvement?.is_positive
        ? "text-green-600 dark:text-green-400"
        : playerData?.recent_improvement?.is_positive === false
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground",
      badge: playerData?.recent_improvement ? (
        <div
          className={`p-1.5 rounded-full ${
            playerData.recent_improvement.is_positive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {playerData.recent_improvement.is_positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
        </div>
      ) : null,
    },
    {
      title: "Overall Progress",
      value: playerData?.overall_improvement
        ? `${playerData.overall_improvement.is_positive ? "+" : ""}${parseFloat(
            playerData.overall_improvement.percentage
          ).toFixed(1)}%`
        : "--",
      description: "Total improvement",
      icon: <TrendingUp className="h-5 w-5 text-secondary-foreground" />,
      color: "from-secondary via-secondary/90 to-secondary/80",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      iconBg: "bg-secondary",
      textAccent: playerData?.overall_improvement?.is_positive
        ? "text-green-600 dark:text-green-400"
        : playerData?.overall_improvement?.is_positive === false
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground",
      badge: playerData?.overall_improvement ? (
        <div
          className={`p-1.5 rounded-full ${
            playerData.overall_improvement.is_positive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {playerData.overall_improvement.is_positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
        </div>
      ) : null,
    },
    {
      title: "Best Performance",
      value: playerData?.best_performance
        ? formatMetricValue(
            playerData.best_performance.value,
            playerData.best_performance.unit
          )
        : "--",
      description:
        playerData?.best_performance?.metric_name || "No data recorded",
      icon: <Trophy className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary/80 via-primary/70 to-primary/60",
      bgColor: "bg-primary/6",
      borderColor: "border-primary/25",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      textAccent: "text-primary/90",
      unit: playerData?.best_performance?.unit,
    },
    {
      title: "Best Category",
      value:
        bestCategory?.average_improvement !== undefined
          ? `+${parseFloat(bestCategory.average_improvement).toFixed(1)}%`
          : "--",
      description: bestCategory?.category_name || "No category data",
      icon: <Star className="h-5 w-5 text-yellow-100" />,
      color: "from-yellow-500 via-yellow-400 to-amber-400",
      bgColor: "bg-yellow-500/8",
      borderColor: "border-yellow-500/30",
      iconBg: "bg-gradient-to-br from-yellow-500 to-amber-500",
      textAccent: "text-yellow-600 dark:text-yellow-400",
      badge:
        bestCategory?.average_improvement !== undefined ? (
          <div className="p-1.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Star className="h-3 w-3" />
          </div>
        ) : null,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] border-2 ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm group`}
        >
          {/* Enhanced Gradient Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-8 group-hover:opacity-12 transition-opacity duration-300`}
          ></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl opacity-40"></div>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground">
              {stat.title}
            </CardTitle>
            <div
              className={`p-3 rounded-xl ${stat.iconBg} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 group-hover:rotate-3`}
            >
              {stat.icon}
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-2 mb-2">
              <div
                className={`text-2xl md:text-3xl font-bold ${stat.textAccent} drop-shadow-sm`}
              >
                {stat.value}
              </div>
              {stat.unit && (
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.unit}
                </span>
              )}
              {stat.badge}
            </div>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlayerProgressStats;
