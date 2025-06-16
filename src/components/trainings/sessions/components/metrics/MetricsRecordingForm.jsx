import React from "react";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Activity, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../ui/button";
import MetricInputField from "./MetricInputField";

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
  onShowCompletionModal,
}) => {  const completedMetrics = metricsToShow.filter((metric) => {
    const value = metricValues[metric.id] || "";
    return value !== "" && !isNaN(parseFloat(value));
  }).length;

  // Check if session is already completed
  const isSessionCompleted = session?.status === 'completed';
  const isLastPlayer = currentPlayerIndex === playersWithMetrics?.length - 1;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 bg-card border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">
                Training Metrics
              </h4>
              <p className="text-sm text-muted-foreground">
                Record performance data for analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {completedMetrics}/{metricsToShow.length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Metrics Recorded
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>
              {Math.round((completedMetrics / metricsToShow.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-secondary/20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-primary/90 h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(completedMetrics / metricsToShow.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
      {/* Metrics List */}
      <ScrollArea className="flex-1 p-6 bg-background">
        <div className="space-y-6">
          {metricsToShow.map((metric, index) => (
            <div key={`${playerTrainingId}-${metric.id}`} className="relative">
              {index > 0 && (
                <div className="absolute -top-3 left-1/2 w-px h-6 bg-border transform -translate-x-1/2" />
              )}
              <MetricInputField
                key={`${playerTrainingId}-${metric.id}-input`}
                metric={metric}
                value={metricValues[metric.id] || ""}
                onChange={(value) => onMetricChange(metric.id, value)}
                notes={notes[metric.id] || ""}
                onNotesChange={(noteValue) =>
                  onNotesChange(metric.id, noteValue)
                }
                playerTrainingId={playerTrainingId}
                fetchImprovement={fetchImprovement}
                getImprovementData={getImprovementData}
              />
            </div>
          ))}
        </div>{" "}
        {/* Completion Message */}
        {completedMetrics === metricsToShow.length &&
          metricsToShow.length > 0 && (
            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <div className="text-center">
                <div className="text-primary mb-2">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  All Metrics Recorded!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Great job! All performance metrics have been captured for this
                  player.
                </p>

                {/* Navigation Buttons */}
                {playersWithMetrics && currentPlayerIndex !== undefined && (
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onPreviousPlayer}
                      disabled={currentPlayerIndex === 0}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous Player
                    </Button>

                    <div className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary font-medium">
                      {currentPlayerIndex + 1} of {playersWithMetrics.length}
                    </div>                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (isLastPlayer && isSessionCompleted) {
                          // If session is completed and this is the last player, show training summary
                          onShowCompletionModal();
                        } else {
                          // Normal next player behavior
                          onNextPlayer();
                        }
                      }}
                      disabled={
                        currentPlayerIndex === playersWithMetrics.length - 1 && !isSessionCompleted
                      }
                      className="flex items-center gap-2"
                    >
                      {isLastPlayer && isSessionCompleted ? (
                        <>
                          View Training Summary
                          <ChevronRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Next Player
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}                {/* Completion Status */}
                {playersWithMetrics &&
                  currentPlayerIndex === playersWithMetrics.length - 1 && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm text-primary font-medium">
                        {isSessionCompleted 
                          ? "🎯 Training session completed! Click to view the training summary."
                          : "🎉 This is the last player! You're all done!"
                        }
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
      </ScrollArea>
    </div>
  );
};

export default MetricsRecordingForm;
