import React from "react";

const PlayerStatistics = ({ playersWithMetrics }) => {
  const completedCount = playersWithMetrics.filter(
    (record) =>
      record.metric_records && record.metric_records.length > 0
  ).length;

  const remainingCount = playersWithMetrics.filter(
    (record) =>
      !record.metric_records ||
      record.metric_records.length === 0
  ).length;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
      <div className="space-y-0.5 sm:space-y-1">
        <div className="text-lg sm:text-2xl font-bold text-primary">
          {playersWithMetrics.length}
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">
          Total
        </div>
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        <div className="text-lg sm:text-2xl font-bold text-green-600">
          {completedCount}
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">
          Done
        </div>
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        <div className="text-lg sm:text-2xl font-bold text-amber-600">
          {remainingCount}
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">
          Left
        </div>
      </div>
    </div>
  );
};

export default PlayerStatistics;
