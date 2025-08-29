import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { getPerformanceTrend } from "../utils/performanceHelpers";

/**
 * Enhanced performance summary component showing player trend analysis
 */
const PerformanceSummary = ({ playerProgress }) => {
  // Show fallback if no data available
  if (!playerProgress?.player_progress?.length) {
    return (
      <Card className="bg-card shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-lg">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gradient">
                Team Performance Summary
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Quick insights about your team's performance trends
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="p-4 bg-muted rounded-full mb-4 mx-auto w-fit">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No Performance Data Available
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Performance trends will appear here once you have players assigned to your teams and training data is recorded.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const improvingCount = playerProgress.player_progress.filter(
    (player) => getPerformanceTrend(player) === "improving"
  ).length;

  const stableCount = playerProgress.player_progress.filter(
    (player) => getPerformanceTrend(player) === "stable"
  ).length;

  const decliningCount = playerProgress.player_progress.filter(
    (player) => getPerformanceTrend(player) === "declining"
  ).length;

  const performanceMetrics = [
    {
      label: "Players Improving",
      value: improvingCount,
      color: "text-secondary",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      icon: <TrendingUp className="h-5 w-5 text-secondary-foreground" />,
      iconBg: "bg-secondary",
      gradient: "from-secondary via-secondary/90 to-secondary/80",
    },
    {
      label: "Players Stable",
      value: stableCount,
      color: "text-muted-foreground",
      bgColor: "bg-muted/20",
      borderColor: "border-border",
      icon: <Minus className="h-5 w-5 text-muted-foreground" />,
      iconBg: "bg-muted",
      gradient: "from-muted via-muted/80 to-muted/60",
    },
    {
      label: "Players Declining",
      value: decliningCount,
      color: "text-primary",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      icon: <TrendingDown className="h-5 w-5 text-primary-foreground" />,
      iconBg: "bg-primary",
      gradient: "from-primary via-primary/90 to-primary/80",
    },
  ];

  return (
    <Card className="bg-card shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gradient">
              Team Performance Summary
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Quick insights about your team's performance trends
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {performanceMetrics.map((metric, index) => (
            <div
              key={index}
              className={`relative overflow-hidden text-center p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.03] group ${metric.bgColor} ${metric.borderColor}`}
            >
              {/* Enhanced Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-8 group-hover:opacity-12 transition-opacity duration-300`}
              ></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl opacity-50"></div>

              <div className="relative z-10 space-y-3">
                <div
                  className={`mx-auto w-12 h-12 rounded-xl ${metric.iconBg} flex items-center justify-center shadow-md`}
                >
                  {metric.icon}
                </div>
                <div
                  className={`text-3xl font-bold ${metric.color} drop-shadow-sm`}
                >
                  {metric.value}
                </div>
                <p className="text-sm font-medium text-muted-foreground tracking-wide">
                  {metric.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced insight section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground text-center">
            {playerProgress.player_progress.length > 0 ? (
              <>
                <span className="font-bold text-primary">
                  {Math.round(
                    (improvingCount / playerProgress.player_progress.length) * 100
                  )}
                  % {" "}
                </span>
                of your players are showing improvement in the last 3 months.
              </>
            ) : (
              "No player data available for performance analysis."
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceSummary;
