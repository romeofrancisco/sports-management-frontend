import React from "react";
import MetricsRecordingForm from "./MetricsRecordingForm";

const PlayerMetricsForm = ({
  metricsToShow,
  metricValues,
  notes,
  handleMetricChange,
  handleNotesChange,
  currentPlayer,
  fetchImprovement,
  getImprovementData,
  currentPlayerIndex,
  playersWithMetrics,
  handlePreviousPlayer,
  handleEnhancedNextPlayer,
  session,
  setShowCompletionModal,
  isFormDisabled,
}) => {
  return (
    <div className="animate-in fade-in-50 duration-500 delay-200 flex-1">
      <div className="h-full bg-card rounded-xl border-2 border-primary/20 overflow-hidden">
        <MetricsRecordingForm
          metricsToShow={metricsToShow}
          metricValues={metricValues}
          notes={notes}
          onMetricChange={handleMetricChange}
          onNotesChange={handleNotesChange}
          playerTrainingId={currentPlayer?.id}
          fetchImprovement={fetchImprovement}
          getImprovementData={getImprovementData}
          currentPlayerIndex={currentPlayerIndex}
          playersWithMetrics={playersWithMetrics}
          onPreviousPlayer={handlePreviousPlayer}
          onNextPlayer={handleEnhancedNextPlayer}
          session={session}
          onShowCompletionModal={() => setShowCompletionModal(true)}
          isFormDisabled={isFormDisabled}
        />
      </div>
    </div>
  );
};

export default PlayerMetricsForm;
