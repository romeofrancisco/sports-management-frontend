import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Radar } from "lucide-react";
import { ProgressChart } from "@/components/charts/PlayerProgressChart/ProgressChart";
import { PlayerRadarChart } from "@/components/charts/PlayerRadarChart";
import { TrainingAnalyticsChart } from "@/components/charts/TeamAnalyticsCharts/TrainingAnalyticsChart";
import { usePlayerMetrics } from "@/hooks/usePlayerMetrics";
import { usePlayerRadarChart } from "@/hooks/useTrainings";
import useChartSummaryModal from "@/hooks/useChartSummaryModal";
import ChartSummaryModal from "@/components/charts/ChartSummaryModal";
import ClickableChartArea from "@/components/charts/ClickableChartArea";

/**
 * Charts section for player dashboard - 3 months summary only
 */
const ChartsSection = ({ user, overview }) => {
  // Get last 3 months date range - memoized to prevent infinite re-renders
  const dateRange = useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return {
      from: threeMonthsAgo.toISOString().split("T")[0], // Use ISO date strings
      to: now.toISOString().split("T")[0],
    };
  }, []); // Empty dependency array since we want a fixed 3-month range

  // Fetch player metrics for progress chart
  const { selectedMetricData, isLoading: metricsLoading } = usePlayerMetrics(
    user?.id,
    dateRange
  );

  // Fetch radar chart data
  const { data: radarData, isLoading: radarLoading } = usePlayerRadarChart(
    user?.id,
    dateRange
  );

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
    fetchSummary: async (chartType) => ({
      data: {
        title:
          chartType === "progress"
            ? "Progress Chart"
            : chartType === "radar"
              ? "Skills Radar"
              : "Training Analytics",
        analysis: {
          insights: [
            chartType === "progress"
              ? "This chart shows your performance trend over the last 3 months."
              : chartType === "radar"
                ? "This radar chart shows strengths and weaker areas by skill category."
                : "This chart shows your training participation pattern across recent sessions.",
          ],
          recommendations: [
            "Focus weekly on your 1-2 lowest metrics while maintaining strengths.",
            "Review this chart every week to confirm improvement direction and consistency.",
          ],
          possible_outcomes: [
            "More balanced skill profile and fewer performance gaps.",
            "Steadier improvement trend over the next training cycle.",
          ],
        },
      },
    }),
  });

  return (
    <div className="space-y-6">
      {/* Progress and Radar Charts */}
      <div className="grid gap-6 sm:grid-cols-5">
        {/* Progress Chart */}
        {user?.id && (
          <ClickableChartArea
            className="col-span-3"
            onOpen={() =>
              openSummary({
                chartType: "progress",
                fallbackTitle: "Progress Chart",
              })
            }
            enabled={!metricsLoading && !!selectedMetricData}
          >
            <Card className="relative overflow-hidden border-2 border-primary/20">
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-lg bg-primary shadow-lg">
                    <Activity className="size-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Progress Chart
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Your performance trends (Last 3 months)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-80">
                  {metricsLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : selectedMetricData ? (
                    <ProgressChart selectedMetricData={selectedMetricData} />
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto size-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Activity className="size-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">
                        No progress metrics available
                      </p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        Complete training sessions to see your progress
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </ClickableChartArea>
        )}

        {/* Radar Chart */}
        {user?.id && (
          <ClickableChartArea
            className="sm:col-span-2"
            onOpen={() =>
              openSummary({
                chartType: "radar",
                fallbackTitle: "Skills Radar",
              })
            }
            enabled={!radarLoading && !!radarData}
          >
            <Card className="relative overflow-hidden border-2 border-primary/20">
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-lg bg-primary shadow-lg">
                    <Radar className="size-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Skills Radar
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Your performance by metric category (Last 3 months)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-80">
                  {radarLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                    </div>
                  ) : radarData ? (
                    <PlayerRadarChart
                      radarData={radarData}
                      showControls={false}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No radar data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </ClickableChartArea>
        )}
      </div>

      {/* Training Analytics */}
      {overview?.training_analytics && (
        <ClickableChartArea
          onOpen={() =>
            openSummary({
              chartType: "training_analytics",
              fallbackTitle: "Training Analytics",
            })
          }
          enabled={true}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent/3 to-transparent" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent shadow-lg">
                  <Activity className="h-5 w-5 text-accent-foreground" />
                </div>
                Training Analytics
              </CardTitle>
              <CardDescription>
                Session participation trends (Last 3 months)
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="h-80">
                <TrainingAnalyticsChart
                  data={overview.training_analytics}
                  title="Training Progress"
                />
              </div>
            </CardContent>
          </Card>
        </ClickableChartArea>
      )}

      <ChartSummaryModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        isLoading={summaryLoading}
        error={error}
        analysis={analysis}
        summaryLines={summaryLines}
      />
    </div>
  );
};

export default ChartsSection;
