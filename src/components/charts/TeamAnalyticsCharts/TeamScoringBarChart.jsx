import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target } from "lucide-react";
import { getDefaultChartOptions, getChartTheme } from "./utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const TeamScoringBarChart = ({
  data,
  title = "Scoring Performance",
  subtitle = "Points scored vs conceded over time",
}) => {
  const isMobile = useIsMobile();

  if (!data || data.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {subtitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No scoring data available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate offensive efficiency trend
  const calculateOffensiveEfficiency = () => {
    if (data.length < 2) return { direction: "neutral", value: 0 };

    const recent =
      data
        .slice(-3)
        .reduce((sum, item) => sum + (item.avg_points_scored || 0), 0) / 3;
    const previous =
      data
        .slice(-6, -3)
        .reduce((sum, item) => sum + (item.avg_points_scored || 0), 0) / 3;

    if (previous === 0) return { direction: "neutral", value: recent };

    const percentage = ((recent - previous) / previous) * 100;
    const direction =
      percentage > 5 ? "up" : percentage < -5 ? "down" : "neutral";

    return { direction, value: recent, percentage: Math.abs(percentage) };
  };

  // Calculate defensive efficiency
  const calculateDefensiveEfficiency = () => {
    if (data.length < 2) return { direction: "neutral", value: 0 };

    const recent =
      data
        .slice(-3)
        .reduce((sum, item) => sum + (item.avg_points_conceded || 0), 0) / 3;
    const previous =
      data
        .slice(-6, -3)
        .reduce((sum, item) => sum + (item.avg_points_conceded || 0), 0) / 3;

    if (previous === 0) return { direction: "neutral", value: recent };

    const percentage = ((recent - previous) / previous) * 100;
    // For defense, lower is better, so we reverse the direction
    const direction =
      percentage < -5 ? "up" : percentage > 5 ? "down" : "neutral";

    return { direction, value: recent, percentage: Math.abs(percentage) };
  };

  const offensiveEff = calculateOffensiveEfficiency();
  const defensiveEff = calculateDefensiveEfficiency();
  const chartData = {
    labels: data.map((item) => item.period),
    datasets: [
      {
        label: "Points Scored",
        data: data.map((item) => item.avg_points_scored || 0),
        backgroundColor: "#ffd70090", // gold
        borderColor: "#ffd700", // gold
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Points Conceded",
        data: data.map((item) => item.avg_points_conceded || 0),
        backgroundColor: "#7f1d1d90",
        borderColor: "#7f1d1d",
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Point Differential",
        data: data.map((item) => item.point_differential || 0),
        backgroundColor: data.map((item) => {
          const diff = item.point_differential || 0;
          return diff >= 0 ? "#f59e0b90" : "#ea580c90"; // amber for positive, orange for negative
        }),
        borderColor: data.map((item) => {
          const diff = item.point_differential || 0;
          return diff >= 0 ? "#f59e0b" : "#ea580c"; // amber for positive, orange for negative
        }),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    ...getDefaultChartOptions(),
    responsive: true,
    plugins: {
      ...getDefaultChartOptions().plugins,
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: getChartTheme().textColor,
          display: isMobile ? false : true,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: 0,
        title: {
          display: true,
          text: "Points",
          color: getChartTheme().textColor,
        },
        ticks: {
          color: getChartTheme().textColor,
        },
        grid: {
          color: getChartTheme().gridColor,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Point Differential",
          color: getChartTheme().textColor,
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: getChartTheme().textColor,
          callback: function (value) {
            return value > 0 ? `+${value}` : value;
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {subtitle}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {" "}
            {/* Offensive Efficiency Badge */}
            {offensiveEff.direction !== "neutral" && (
              <Badge
                variant="outline"
                className={`${
                  offensiveEff.direction === "up"
                    ? "text-amber-600 border-amber-600"
                    : "text-red-900 border-red-900"
                }`}
              >
                <Target className="mr-1 h-3 w-3" />
                Off: {offensiveEff.direction === "up" ? "+" : "-"}
                {offensiveEff.percentage.toFixed(1)}%
              </Badge>
            )}
            {/* Defensive Efficiency Badge */}
            {defensiveEff.direction !== "neutral" && (
              <Badge
                variant="outline"
                className={`${
                  defensiveEff.direction === "up"
                    ? "text-amber-600 border-amber-600"
                    : "text-red-900 border-red-900"
                }`}
              >
                <Target className="mr-1 h-3 w-3" />
                Def: {defensiveEff.direction === "up" ? "+" : "-"}
                {defensiveEff.percentage.toFixed(1)}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Summary Stats */}
      </CardContent>
    </Card>
  );
};
