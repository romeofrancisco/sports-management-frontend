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
            ? "Tournament Differential Analysis"
            : chartType === "streak"
              ? "Tournament Streak Analysis"
              : "Tournament Points Analysis",
        analysis: {
          insights: [
            "This tournament chart captures current team momentum and scoring performance.",
            isSetsScoring
              ? "Set-based patterns reveal clutch performance in deciding sets."
              : "Point-based patterns reveal offensive and defensive stability under pressure.",
          ],
          recommendations: [
            "Prioritize tactical prep for teams showing downward streak or widening negative differential.",
            "Use top performers as match-plan references for knockout stages.",
          ],
          possible_outcomes: [
            "More predictable tournament progression and fewer avoidable upsets.",
            "Improved match readiness in late-stage fixtures.",
          ],
        },
      },
    }),
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <ClickableChartArea
          className="lg:col-span-3"
          onOpen={() =>
            openSummary({
              chartType: "differential",
              fallbackTitle: "Tournament Differential Analysis",
            })
          }
        >
          <DifferentialChart
            data={differentialData}
            isSetsScoring={isSetsScoring}
            className="lg:col-span-3"
          />
        </ClickableChartArea>
        <ClickableChartArea
          className="lg:col-span-2"
          onOpen={() =>
            openSummary({
              chartType: "streak",
              fallbackTitle: "Tournament Streak Analysis",
            })
          }
        >
          <StreakChart
            data={streakData}
            isSetsScoring={isSetsScoring}
            className="lg:col-span-2"
          />
        </ClickableChartArea>
      </div>

      <div className="grid grid-cols-1">
        <ClickableChartArea
          onOpen={() =>
            openSummary({
              chartType: "points",
              fallbackTitle: "Tournament Points Analysis",
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

export default TournamentCharts;
