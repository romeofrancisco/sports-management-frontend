import React from "react";
import { useLeagueComprehensiveStats } from "@/hooks/useLeagues";
import Loading from "@/components/common/FullLoading";
import useChartSummaryModal from "@/hooks/useChartSummaryModal";
import ChartSummaryModal from "@/components/charts/ChartSummaryModal";
import ClickableChartArea from "@/components/charts/ClickableChartArea";
import {
  PerformanceComparisonChart,
  WinDistributionChart,
  ScoringAnalysisChart,
} from "./index";

const LeagueCharts = ({ leagueId, sport, className = "" }) => {
  const { data: stats, isLoading } = useLeagueComprehensiveStats(leagueId);
  const {
    isOpen,
    setIsOpen,
    title,
    summaryLines,
    analysis,
    error,
    isLoading: summaryLoading,
    openSummary,
  } = useChartSummaryModal({
    fetchSummary: async (chartType) => {
      const teams = stats?.teams || [];
      const insightsByType = {
        performance_comparison: [
          `This chart compares performance across ${teams.length} teams in the league.`,
          "Use ranking and spread patterns to identify dominant and underperforming teams.",
        ],
        win_distribution: [
          "This chart shows how wins are distributed among teams.",
          "Skewed distributions usually indicate competitive imbalance in the current league stage.",
        ],
        scoring_analysis: [
          "This chart summarizes scoring output and defensive concessions across teams.",
          "Large variance between teams can highlight tactical mismatch or roster depth gaps.",
        ],
      };

      return {
        data: {
          title:
            chartType === "performance_comparison"
              ? "League Performance Comparison"
              : chartType === "win_distribution"
                ? "Win Distribution"
                : "Scoring Analysis",
          analysis: {
            insights: insightsByType[chartType] || [],
            recommendations: [
              "Run targeted review sessions for bottom-third teams and focus on their weakest KPI from the chart.",
              "Use top-performing teams as benchmark templates for training structure and tactical planning.",
            ],
            possible_outcomes: [
              "Better parity across the league and fewer one-sided results.",
              "Improved quality of competition as lagging teams close performance gaps.",
            ],
          },
        },
      };
    },
  });

  const isSetBased = stats?.scoring_type === "sets"; // Determine if the sport is set-based (like volleyball) or point-based (like basketball)

  if (isLoading) return <Loading />;
  if (!stats) return <div>No statistics available</div>;
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ClickableChartArea
          className="lg:col-span-2"
          onOpen={() =>
            openSummary({
              chartType: "performance_comparison",
              fallbackTitle: "League Performance Comparison",
            })
          }
        >
          <PerformanceComparisonChart
            className="lg:col-span-2"
            teams={stats.teams}
            isSetBased={isSetBased}
          />
        </ClickableChartArea>
        <ClickableChartArea
          onOpen={() =>
            openSummary({
              chartType: "win_distribution",
              fallbackTitle: "Win Distribution",
            })
          }
        >
          <WinDistributionChart teams={stats.teams} isSetBased={isSetBased} />
        </ClickableChartArea>
      </div>

      {/* Scoring Analysis Chart Row */}
      <div className="grid grid-cols-1 gap-6">
        <ClickableChartArea
          onOpen={() =>
            openSummary({
              chartType: "scoring_analysis",
              fallbackTitle: "Scoring Analysis",
            })
          }
        >
          <ScoringAnalysisChart teams={stats.teams} isSetBased={isSetBased} />
        </ClickableChartArea>
      </div>

      <ChartSummaryModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        isLoading={summaryLoading}
        error={error}
        analysis={analysis}
        summaryLines={summaryLines}
      />
    </>
  );
};

export default LeagueCharts;
