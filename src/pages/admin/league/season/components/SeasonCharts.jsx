import React from "react";
import { PointsChart, StreakChart, DifferentialChart } from "@/components/charts/SeasonCharts";

/**
 * Component for displaying all season charts
 * @param {Object} pointsData - Data for points chart
 * @param {Object} streakData - Data for streak chart
 * @param {Object} differentialData - Data for differential chart
 * @param {boolean} isSetsScoring - Whether the sport uses sets scoring
 */
export const SeasonCharts = ({ pointsData, streakData, differentialData, isSetsScoring }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PointsChart data={pointsData} isSetsScoring={isSetsScoring} />
        <StreakChart data={streakData} isSetsScoring={isSetsScoring} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DifferentialChart data={differentialData} isSetsScoring={isSetsScoring} />
      </div>
    </div>
  );
};
