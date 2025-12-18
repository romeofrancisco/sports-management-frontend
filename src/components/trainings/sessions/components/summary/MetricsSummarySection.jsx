import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, TrendingDown } from "lucide-react";

const MetricsSummarySection = ({ metricsSummary }) => {
  return (
    <div className="animate-in fade-in-50 duration-500 delay-400">
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-primary/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl opacity-60"></div>

        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-sm">
              <Target className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Training Metrics Summary</CardTitle>
              <CardDescription>
                Performance training metrics captured and analysis breakdown
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="group relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in-50 duration-500">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Records
                </CardTitle>
                <div className="p-2 rounded-lg border bg-primary/10 text-primary border-primary/30">
                  <Target className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {metricsSummary.total_metrics_recorded}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Performance measurements
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in-50 duration-500" style={{ animationDelay: '100ms' }}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unique Training Metrics
                </CardTitle>
                <div className="p-2 rounded-lg border bg-primary/10 text-primary border-primary/30">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {metricsSummary.unique_metrics}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Different training metrics tracked
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in-50 duration-500" style={{ animationDelay: '200ms' }}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Players Recorded
                </CardTitle>
                <div className="p-2 rounded-lg border bg-primary/10 text-primary border-primary/30">
                  <TrendingDown className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {metricsSummary.players_with_metrics}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active participants
                </p>
              </CardContent>
            </Card>
          </div>

          {metricsSummary.metrics_breakdown &&
            metricsSummary.metrics_breakdown.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Training Metrics Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {metricsSummary.metrics_breakdown.map((metric, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br border-2 border-primary/20 rounded-xl p-5 relative overflow-hidden"
                    >
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-60"></div>

                      {/* Header */}
                      <div className="flex items-start justify-between mb-4 relative">
                        <div className="flex-1">
                          <h5 className="font-semibold text-foreground text-lg mb-1">
                            {metric.metric__name}
                          </h5>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-primary/15 text-primary border-primary/40 font-medium"
                            >
                              {metric.records_count} records
                            </Badge>{" "}
                            <Badge
                              variant="outline"
                              className={`font-medium ${
                                metric.unique_players /
                                  metricsSummary.players_with_metrics >=
                                0.8
                                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                  : metric.unique_players /
                                      metricsSummary.players_with_metrics >=
                                    0.5
                                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                  : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                              }`}
                            >
                              {metric.unique_players}/
                              {metricsSummary.players_with_metrics} completed
                            </Badge>
                          </div>
                        </div>
                        <div
                          className={`p-2 rounded-lg ${
                            metric.metric__is_lower_better
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary/20 text-secondary"
                          }`}
                        >
                          {metric.metric__is_lower_better ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                        </div>
                      </div>

                      {/* Statistics Grid */}
                      <div className="grid grid-cols-3 gap-3 relative">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                            Average
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {Number(metric.avg_value).toFixed(2)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {metric.metric__metric_unit__code}
                            </span>
                          </p>
                        </div>

                        <div className="text-center border-l border-r border-border/30 px-2">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                            {metric.metric__is_lower_better
                              ? "Best"
                              : "Highest"}
                          </p>
                          <p className="text-lg font-bold text-secondary">
                            {Number(
                              metric.metric__is_lower_better
                                ? metric.min_value
                                : metric.max_value
                            ).toFixed(2)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {metric.metric__metric_unit__code}
                            </span>
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                            {metric.metric__is_lower_better
                              ? "Worst"
                              : "Lowest"}
                          </p>
                          <p className="text-lg font-bold text-destructive">
                            {Number(
                              metric.metric__is_lower_better
                                ? metric.max_value
                                : metric.min_value
                            ).toFixed(2)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {metric.metric__metric_unit__code}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Progress indicator */}
                      <div className="mt-4 relative">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>Participation</span>
                          <span>
                            {Math.round(
                              (metric.unique_players /
                                metricsSummary.players_with_metrics) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-muted/50 rounded-full h-2 relative overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${Math.min(
                                100,
                                (metric.unique_players /
                                  metricsSummary.players_with_metrics) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsSummarySection;
