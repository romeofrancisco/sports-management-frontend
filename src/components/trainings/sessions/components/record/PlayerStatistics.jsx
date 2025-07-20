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
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="space-y-1">
        <div className="text-2xl font-bold text-primary">
          {playersWithMetrics.length}
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Total Players
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-green-600">
          {completedCount}
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Completed
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-amber-600">
          {remainingCount}
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Remaining
        </div>
      </div>
    </div>
  );
};

export default PlayerStatistics;
