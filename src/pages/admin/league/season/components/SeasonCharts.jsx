import React from "react";
import useChartSummaryModal from "@/hooks/useChartSummaryModal";
import ChartSummaryModal from "@/components/charts/ChartSummaryModal";
import ClickableChartArea from "@/components/charts/ClickableChartArea";
import {
  PointsChart,
  StreakChart,
  DifferentialChart,
} from "@/components/charts/SeasonCharts";

/**
 * Component for displaying all season charts
 * @param {Object} pointsData - Data for points chart
 * @param {Object} streakData - Data for streak chart
 * @param {Object} differentialData - Data for differential chart
 * @param {boolean} isSetsScoring - Whether the sport uses sets scoring
 */
export const SeasonCharts = ({
  pointsData,
  streakData,
  differentialData,
  isSetsScoring,
}) => {
  const {
    isOpen,
    setIsOpen,
    title,
    summaryLines,
    analysis,
    error,
    isLoading,
    openSummary,
  } = useChartSummaryModal({
    fetchSummary: async (chartType) => ({
      data: {
        title:
          chartType === "differential"
            ? "Differential Analysis"
            : chartType === "streak"
              ? "Streak Analysis"
              : "Points Analysis",
        analysis: {
          insights: [
            "This chart highlights team-level season performance patterns.",
            isSetsScoring
              ? "Set-based trends help identify consistency in closing sets and match control."
              : "Point-based trends help identify scoring pace and defensive pressure.",
          ],
          recommendations: [
            "Use this chart to isolate underperforming teams and create focused tactical adjustments.",
            "Track trend shifts weekly to validate whether interventions are working.",
          ],
          possible_outcomes: [
            "More stable team performance across the remaining fixtures.",
            "Earlier detection of teams at risk of form decline.",
          ],
        },
      },
    }),
  });

  return (
    <div className= "space-y-4">
      <div className= "grid grid-cols-1 lg:grid-cols-5 gap-4">
        <ClickableChartArea
          className= "lg:col-span-3"
          onOpen={() =>
            openSummary({
              chartType: "differential",
              fallbackTitle: "Differential Analysis",
            })
          }
        >
          <DifferentialChart
            data={differentialData}
            isSetsScoring={isSetsScoring}
            className= "lg:col-span-3"
          />
        </ClickableChartArea>
        <ClickableChartArea
          className= "lg:col-span-2"
          onOpen={() =>
            openSummary({
              chartType: "streak",
              fallbackTitle: "Streak Analysis",
            })
          }
        >
          <StreakChart
            data={streakData}
            isSetsScoring={isSetsScoring}
            className= "lg:col-span-2"
          />
        </ClickableChartArea>
      </div>

      <div className= "grid grid-cols-1">
        <ClickableChartArea
          onOpen={() =>
            openSummary({
              chartType: "points",
              fallbackTitle: "Points Analysis",
            })
          }
        >
          <PointsChart data={pointsData} isSetsScoring={isSetsScoring} />
        </ClickableChartArea>
      </div>

      <ChartSummaryModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        isLoading={isLoading}
        error={error}
        analysis={analysis}
        summaryLines={summaryLines}
      />
    </div>
  );
};
