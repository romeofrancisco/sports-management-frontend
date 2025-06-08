import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

/**
 * Enhanced Personal progress section for player dashboard
 */
const PersonalProgressSection = ({ progress }) => {
  return (
    <Card className="bg-card shadow-lg border-2 border-secondary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gradient">
              Recent Personal Progress
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your training and development metrics trends over the past 90 days
            </CardDescription>
          </div>
        </div>      </CardHeader>
      <CardContent>
        {progress?.metric_trends &&
        Object.keys(progress.metric_trends).length > 0 ? (
          <div className="grid gap-4 md:grid-cols-1">
            {Object.entries(progress.metric_trends)
              .slice(0, 5)
              .map(([metricName, metricData], index) => {
                // Get only the latest metric value
                const latestMetric = metricData[metricData.length - 1];
                const currentValue = latestMetric?.value || 0;
                const unit = latestMetric?.unit || "";

                // Use backend-calculated improvement percentage
                const improvementPercentage =
                  latestMetric?.improvement_percentage || 0;
                const isImproving = improvementPercentage > 0;
                const progressValue = Math.min(
                  100,
                  Math.abs(improvementPercentage)
                );

                return (
                  <div
                    key={index}
                    className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                  >
                    {/* Enhanced background effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{metricName}</span>
                        <span className="text-muted-foreground">
                          {currentValue} {unit}
                        </span>
                      </div>
                      <Progress
                        value={progressValue}
                        className={`h-2 ${isImproving ? "" : "opacity-60"}`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Last 3 months improvement</span>
                        <span
                          className={
                            isImproving ? "text-green-600" : "text-red-600"
                          }
                        >
                          {isImproving ? "+" : ""}
                          {improvementPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground font-medium">No progress metrics available</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Complete training sessions to see your progress
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalProgressSection;
