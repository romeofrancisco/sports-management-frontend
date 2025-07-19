import React from "react";
import MetricsProgressHeader from "./MetricsProgressHeader";
import MetricsCompletionMessage from "./MetricsCompletionMessage";
import MetricInputField from "../metrics/MetricInputField";

const MetricsRecordingForm = ({
  metricsToShow,
  metricValues,
  notes,
  onMetricChange,
  onNotesChange,
  playerTrainingId,
  fetchImprovement,
  getImprovementData,
  // Add navigation props for completion message
  currentPlayerIndex,
  playersWithMetrics,
  onPreviousPlayer,
  onNextPlayer,
  session,
  navigate,
  isFormDisabled = false,
  // Add current player and hasChanges back
  currentPlayer,
  hasChanges,
}) => {
  const completedMetrics = metricsToShow.filter((metric) => {
    const value = metricValues[metric.id] || "";
    return value !== "" && !isNaN(parseFloat(value));
  }).length;

  const isAllMetricsCompleted = completedMetrics === metricsToShow.length && metricsToShow.length > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Metrics Progress Header */}
      <MetricsProgressHeader 
        completedMetrics={completedMetrics}
        totalMetrics={metricsToShow.length}
        currentPlayer={currentPlayer}
        metricsToShow={metricsToShow}
        metricValues={metricValues}
        hasChanges={hasChanges}
        playersWithMetrics={playersWithMetrics}
      />

      {/* Metrics List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
        {metricsToShow.map((metric) => (
          <MetricInputField
            key={`${playerTrainingId}-${metric.id}-input`}
            metric={metric}
            value={metricValues[metric.id] || ""}
            onChange={(value) => onMetricChange(metric.id, value)}
            notes={notes[metric.id] || ""}
            onNotesChange={(noteValue) => onNotesChange(metric.id, noteValue)}
            playerTrainingId={playerTrainingId}
            fetchImprovement={fetchImprovement}
            getImprovementData={getImprovementData}
            isFormDisabled={isFormDisabled}
          />
        ))}
      </div>

      {/* Completion Message */}
      {isAllMetricsCompleted && (
        <div className="p-3 sm:p-6">
          <MetricsCompletionMessage
            currentPlayerIndex={currentPlayerIndex}
            playersWithMetrics={playersWithMetrics}
            onPreviousPlayer={onPreviousPlayer}
            onNextPlayer={onNextPlayer}
            session={session}
            navigate={navigate}
          />
        </div>
      )}
    </div>
  );
};

export default MetricsRecordingForm;
