import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { useMetricUnits } from "@/hooks/useMetricUnits";
import { BarChart3 } from "lucide-react";
import { usePlayerMetricsRecording } from "./metrics/usePlayerMetricsRecording";
import PlayerProgressBar from "./metrics/PlayerProgressBar";
import PlayerNavigationHeader from "./metrics/PlayerNavigationHeader";
import MetricsRecordingForm from "./metrics/MetricsRecordingForm";
import EmptyPlayersState from "./metrics/EmptyPlayersState";
import SuccessAnimation from "./metrics/SuccessAnimation";

const PlayerMetricsRecording = ({ session, onSaveSuccess }) => {
  const [showSuccessAnimation, setShowSuccessAnimation] = React.useState(false);
  
  const {
    currentPlayerIndex,
    currentPlayer,
    playersWithMetrics,
    metricsToShow,
    metricValues,
    notes,
    hasChanges,
    hasValidMetrics,
    handlePreviousPlayer,
    handleNextPlayer,
    handleMetricChange,
    handleNotesChange,
    fetchImprovement,
    getImprovementData,
    savePlayerMetrics,
    isLoading,  } = usePlayerMetricsRecording(session);

  // Check if there are players with metrics configured
  if (playersWithMetrics.length === 0) {
    return <EmptyPlayersState />;
  }
  return (
    <Card className="h-full flex flex-col shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Player Metrics Recording</h2>
            <p className="text-blue-100 text-sm font-normal mt-1">
              Step 4 of training session setup
            </p>
          </div>
        </CardTitle>
        <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-blue-100 text-sm leading-relaxed">
            📊 Record performance metrics for each player. Navigate through players to enter their training data and track improvements in real-time.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 flex flex-col h-full p-8">{/* Progress Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <PlayerProgressBar
            currentPlayerIndex={currentPlayerIndex}
            playersWithMetrics={playersWithMetrics}
          />
        </div>

        {/* Player Navigation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <PlayerNavigationHeader
            currentPlayerIndex={currentPlayerIndex}
            playersWithMetrics={playersWithMetrics}
            currentPlayer={currentPlayer}
            hasValidMetrics={hasValidMetrics}
            hasChanges={hasChanges}
            metricsToShow={metricsToShow}
            onPreviousPlayer={handlePreviousPlayer}
            onNextPlayer={handleNextPlayer}
          />
        </div>

        {/* Metrics Recording Form */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <MetricsRecordingForm
            metricsToShow={metricsToShow}
            metricValues={metricValues}
            notes={notes}
            onMetricChange={handleMetricChange}
            onNotesChange={handleNotesChange}
            playerTrainingId={currentPlayer?.id}
            fetchImprovement={fetchImprovement}
            getImprovementData={getImprovementData}
          />        </div>
      </CardContent>
      
      {/* Success Animation */}
      <SuccessAnimation
        isVisible={showSuccessAnimation}
        onComplete={() => setShowSuccessAnimation(false)}
        message="Player metrics saved!"
      />
    </Card>
  );
};

export default PlayerMetricsRecording;
