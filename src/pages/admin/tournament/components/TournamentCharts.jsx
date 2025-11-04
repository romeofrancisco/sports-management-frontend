import React from "react";
import {
  PointsChart,
  StreakChart,
  DifferentialChart,
} from "@/components/charts/SeasonCharts";

/**
 * Component for displaying all tournament charts
 * @param {Object} pointsData - Data for points chart
 * @param {Object} streakData - Data for streak chart
 * @param {Object} differentialData - Data for differential chart
 * @param {boolean} isSetsScoring - Whether the sport uses sets scoring
 */
const TournamentCharts = ({
  pointsData,
  streakData,
  differentialData,
  isSetsScoring,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <DifferentialChart
          data={differentialData}
          isSetsScoring={isSetsScoring}
          className="lg:col-span-3"
        />
        <StreakChart
          data={streakData}
          isSetsScoring={isSetsScoring}
          className="lg:col-span-2"
        />
      </div>

      <div className="grid grid-cols-1">
        <PointsChart data={pointsData} isSetsScoring={isSetsScoring} />
      </div>
    </div>
  );
};

export default TournamentCharts;
