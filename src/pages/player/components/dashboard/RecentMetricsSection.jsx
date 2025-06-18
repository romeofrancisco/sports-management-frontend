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
 * Enhanced Recent metrics section for player dashboard
 */
const RecentMetricsSection = ({ overview }) => {
  return (
    <Card className="bg-card shadow-lg border-2 border-secondary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gradient">
              Recent Training Metrics
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your latest performance measurements
            </CardDescription>
          </div>
        </div>      </CardHeader>
      <CardContent>
        {overview?.recent_metrics?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {overview.recent_metrics.slice(0, 6).map((metric, index) => (
              <div
                key={index}
                className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
              >
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 text-center">
                  <div className="text-lg font-bold text-primary mb-1">
                    {metric.value} {metric.unit}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {metric.metric_name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(metric.session_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground font-medium">No recent metrics available</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Complete training sessions to see metrics
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentMetricsSection;
