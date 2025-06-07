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
 * Personal progress section for player dashboard
 */
const PersonalProgressSection = ({ progress }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent/3 to-transparent" />
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent shadow-lg">
            <Target className="h-4 w-4 text-accent-foreground" />
          </div>
          Recent Personal Progress (Last 3 Months)
        </CardTitle>
        <CardDescription>
          Your training and development metrics trends over the past 90 days
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        {progress?.metric_trends &&
        Object.keys(progress.metric_trends).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(progress.metric_trends)
              .slice(0, 6)
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
                    className="space-y-2 p-3 border rounded-lg bg-card/50 backdrop-blur-sm transition-all duration-200 hover:bg-card/80"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metricName}</span>
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
                );
              })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No progress metrics available</p>
            <p className="text-sm">
              Complete training sessions to see your progress
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalProgressSection;
