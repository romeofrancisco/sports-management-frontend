import React from "react";
import PlayerProgressStats from "./PlayerProgressStats";
import {
  PerformanceInsightCard,
  RadarAnalysisSummaryCard,
  ProgressChartCard,
  RadarChartCard,
  CategoryBreakdown,
  QuickActionsCard,
} from "./dashboard";
import { usePlayerRadarChart } from "@/hooks/useTrainings";
import useChartSummaryModal from "@/hooks/useChartSummaryModal";
import ChartSummaryModal from "@/components/charts/ChartSummaryModal";
import ClickableChartArea from "@/components/charts/ClickableChartArea";

const PlayerProgressIndividualView = ({ playerId, playerName, dateRange }) => {
  // Get radar data for the CategoryBreakdown component
  const { data: radarData } = usePlayerRadarChart(
    playerId,
    dateRange,
    !!playerId
  );
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
          chartType === "progress"
            ? "Player Progress Trend"
            : chartType === "radar"
              ? "Player Skills Radar"
              : "Category Breakdown",
        analysis: {
          insights: [
            "This chart highlights individual development patterns over the selected period.",
            "Comparing trend and radar views helps distinguish consistency from isolated spikes.",
          ],
          recommendations: [
            "Set one technical and one physical target based on your lowest chart area.",
            "Re-check chart movement weekly to confirm that training focus is working.",
          ],
          possible_outcomes: [
            "Clearer short-term progression path with measurable checkpoints.",
            "Reduced weak-area drag on overall performance.",
          ],
        },
      },
    }),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="space-y-6">
        {/* Performance Stats Overview */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <PlayerProgressStats playerId={playerId} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Charts Section - Takes up most space */}
          <div className="xl:col-span-8 space-y-6">
            {/* Progress Chart */}
            <ClickableChartArea
              onOpen={() =>
                openSummary({
                  chartType: "progress",
                  fallbackTitle: "Player Progress Trend",
                })
              }
            >
              <ProgressChartCard playerId={playerId} dateRange={dateRange} />
            </ClickableChartArea>
            {/* Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
              {/* Radar Chart - Takes 1 column */}
              <ClickableChartArea
                className="flex col-span-5 lg:col-span-2"
                onOpen={() =>
                  openSummary({
                    chartType: "radar",
                    fallbackTitle: "Player Skills Radar",
                  })
                }
              >
                <RadarChartCard
                  playerId={playerId}
                  playerName={playerName}
                  dateRange={dateRange}
                  className="w-full h-full"
                />
              </ClickableChartArea>

              {/* Category Breakdown - Takes 1 column */}
              <ClickableChartArea
                className="flex col-span-5 lg:col-span-3"
                onOpen={() =>
                  openSummary({
                    chartType: "category_breakdown",
                    fallbackTitle: "Category Breakdown",
                  })
                }
              >
                <CategoryBreakdown
                  categories={radarData?.categories || []}
                  className="w-full h-full"
                />
              </ClickableChartArea>
            </div>
          </div>

          {/* Sidebar with Insights and Actions */}
          <div className="xl:col-span-4 grid xl:block xl:grid-cols-1 grid-cols-1 md:grid-cols-2 gap-6 xl:space-y-6">
            {/* Performance Insights */}
            <div className="animate-in fade-in-50 duration-500 delay-400">
              <PerformanceInsightCard
                playerId={playerId}
                dateRange={dateRange}
              />
            </div>

            {/* Radar Analysis Summary */}
            <div className="animate-in fade-in-50 duration-500 delay-500">
              <RadarAnalysisSummaryCard
                playerId={playerId}
                dateRange={dateRange}
              />
            </div>
          </div>
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
    </div>
  );
};

export default PlayerProgressIndividualView;
