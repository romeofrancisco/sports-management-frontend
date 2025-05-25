import React, { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { usePlayerMetrics } from "@/hooks/usePlayerMetrics";
import { useTrainingMetrics, usePlayerProgressById } from "@/hooks/useTrainings";
import { ChartHeader } from "./ChartHeader";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { NoMetricsState } from "./NoMetricsState";
import { NoDataState } from "./NoDataState";
import { ProgressChart } from "./ProgressChart";
import { SelectMetricPrompt } from "./SelectMetricPrompt";
import { PerformanceAnalysisSection } from "./PerformanceAnalysisSection";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler,
  annotationPlugin
);

/**
 * Main PlayerProgressChart component
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.playerId - ID of the player to display progress for
 * @param {string|null} [props.teamSlug=null] - Optional team slug
 * @param {Object|null} [props.dateRange=null] - Optional date range for filtering data (with from/to props)
 * @param {Function} [props.onDateChange] - Optional callback for date range changes
 * @returns {JSX.Element} Rendered component
 */
const PlayerProgressChart = ({
  playerId,
  dateRange = null,
  onDateChange,
}) => {
  // Use our dedicated hook for player metrics data
  const {
    playerData,
    metrics,
    selectedMetric,
    selectedMetricData,
    effectiveDateRange,
    isLoading,
    error,
    hasMetricsData,
    hasDataPoints,
    setSelectedMetric,
    handleDateChange: internalHandleChange,
  } = usePlayerMetrics(playerId, dateRange);
  
  // Use provided onDateChange if available, otherwise use the internal one
  const handleDateChange = onDateChange || internalHandleChange;
    // Handle early error and empty states (but not loading)
  if (error) return <ErrorState error={error} />;

  if (!playerData && !isLoading) return <EmptyState message="No player data available" />;
  return (
    <Card className="border-0 shadow-none">
      <ChartHeader
        playerName={playerData?.player_name || "Player"}
        metrics={metrics || []}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
        selectedMetricData={selectedMetricData}
      />
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : !hasMetricsData ? (
          <NoMetricsState />
        ) : !selectedMetric ? (
          <SelectMetricPrompt />
        ) : hasDataPoints ? (
          <ProgressChart selectedMetricData={selectedMetricData} />
        ) : (
          <NoDataState />
        )}
        <PerformanceAnalysisSection 
          metricData={selectedMetricData}
          playerData={playerData}
          selectedMetric={selectedMetric}
        />
      </CardContent>
    </Card>
  );
};

export default PlayerProgressChart;
