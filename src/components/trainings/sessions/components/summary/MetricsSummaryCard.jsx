import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

const MetricsSummaryCard = ({ metrics, safeMetricsSummary }) => {
  return (
    <div className="animate-in fade-in-50 duration-500 delay-400">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-secondary/20 transition-all duration-300 hover:shadow-2xl hover:border-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl opacity-60"></div>
        <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-secondary/20 relative">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg shadow-lg">
              <Target className="h-5 w-5 text-secondary-foreground" />
            </div>
            Metrics Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-primary/8 to-primary/4 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Total Records
              </p>
              <p className="text-2xl font-bold text-primary">
                {safeMetricsSummary.total_metrics_recorded}
              </p>
            </div>
            <div className="bg-gradient-to-br from-secondary/8 to-secondary/4 rounded-lg p-4 border border-secondary/20">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-secondary">
                {safeMetricsSummary.completion_rate}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/8 to-primary/4 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Unique Metrics
              </p>
              <p className="text-2xl font-bold text-primary">
                {safeMetricsSummary.unique_metrics}
              </p>
            </div>
            <div className="bg-gradient-to-br from-secondary/8 to-secondary/4 rounded-lg p-4 border border-secondary/20">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Players Recorded
              </p>
              <p className="text-2xl font-bold text-secondary">
                {safeMetricsSummary.players_with_metrics}
              </p>
            </div>
          </div>

          {safeMetricsSummary.metrics_breakdown &&
            safeMetricsSummary.metrics_breakdown.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Metrics Breakdown
                </h4>
                <div className="space-y-3">
                  {safeMetricsSummary.metrics_breakdown.map(
                    (metric, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gradient-to-r from-muted/40 to-muted/20 border border-border/50 rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <span className="font-medium text-foreground">
                          {metric.metric__name}
                        </span>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary border-primary/30"
                          >
                            {metric.records_count} records
                          </Badge>
                          <span className="text-sm text-muted-foreground font-medium">
                            Avg: {Number(metric.avg_value).toFixed(2)}
                            {metric.metric__metric_unit__code}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsSummaryCard;
