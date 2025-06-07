import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy } from "lucide-react";

/**
 * Recent metrics section for player dashboard
 */
const RecentMetricsSection = ({ overview }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent" />
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary shadow-lg">
            <Trophy className="h-4 w-4 text-primary-foreground" />
          </div>
          Recent Training Metrics
        </CardTitle>
        <CardDescription>Your latest performance measurements</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        {overview?.recent_metrics?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {overview.recent_metrics.slice(0, 6).map((metric, index) => (
              <div
                key={index}
                className="text-center p-3 border rounded-lg bg-card/50 backdrop-blur-sm transition-all duration-200 hover:bg-card/80 hover:scale-105"
              >
                <div className="text-lg font-bold text-primary">
                  {metric.value} {metric.unit}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {metric.metric_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(metric.session_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent metrics available</p>
            <p className="text-sm">Complete training sessions to see metrics</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentMetricsSection;
