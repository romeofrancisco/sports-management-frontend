import React from "react";
import { PointsChart, WinsChart, StreakChart, DifferentialChart } from "@/components/charts/SeasonCharts";

/**
 * Component for displaying all season charts
 * @param {Object} pointsData - Data for points chart
 * @param {Object} winsData - Data for wins chart
 * @param {Object} streakData - Data for streak chart
 * @param {Object} differentialData - Data for differential chart
 * @param {boolean} isSetsScoring - Whether the sport uses sets scoring
 */
export const SeasonCharts = ({ pointsData, winsData, streakData, differentialData, isSetsScoring }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <PointsChart data={pointsData} isSetsScoring={isSetsScoring} />
        <WinsChart data={winsData} isSetsScoring={isSetsScoring} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StreakChart data={streakData} isSetsScoring={isSetsScoring} />
        <DifferentialChart data={differentialData} isSetsScoring={isSetsScoring} />
      </div>
    </>
  );
};
