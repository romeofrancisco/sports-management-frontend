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
              <CardTitle>Metrics Summary</CardTitle>
              <CardDescription>
                Performance metrics captured and analysis breakdown
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-primary/8 to-primary/4 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Total Records
              </p>
              <p className="text-2xl font-bold text-primary">
                {metricsSummary.total_metrics_recorded}
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/8 to-primary/4 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-primary">
                {metricsSummary.completion_rate}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/8 to-primary/4 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Unique Metrics
              </p>
              <p className="text-2xl font-bold text-primary">
                {metricsSummary.unique_metrics}
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/8 to-primary/4 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Players Recorded
              </p>
              <p className="text-2xl font-bold text-primary">
                {metricsSummary.players_with_metrics}
              </p>
            </div>
          </div>

          {metricsSummary.metrics_breakdown &&
            metricsSummary.metrics_breakdown.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Metrics Breakdown
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            </Badge>                            <Badge
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
