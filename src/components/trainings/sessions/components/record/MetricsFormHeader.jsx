import React from "react";
import { Activity, TrendingUp } from "lucide-react";

const MetricsFormHeader = ({ completedMetrics, totalMetrics }) => {
  const progressPercentage = Math.round((completedMetrics / totalMetrics) * 100);

  return (
    <div className="p-6 bg-card border-b border-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-base sm:text-lg font-semibold text-foreground">
              Training Metrics
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Record performance data for analysis
            </p>
          </div>
        </div>

        {/* Metrics Counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {completedMetrics}/{totalMetrics}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Metrics Recorded
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-secondary/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-primary/90 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MetricsFormHeader;
