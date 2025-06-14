import React from "react";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Activity, TrendingUp } from "lucide-react";
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
}) => {
  const completedMetrics = metricsToShow.filter(metric => {
    const value = metricValues[metric.id] || "";
    return value !== "" && !isNaN(parseFloat(value));
  }).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Training Metrics</h4>
              <p className="text-sm text-gray-600">Record performance data for analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {completedMetrics}/{metricsToShow.length}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Metrics Recorded
              </div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round((completedMetrics / metricsToShow.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedMetrics / metricsToShow.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metrics List */}
      <ScrollArea className="flex-1 p-6">        <div className="space-y-6">
          {metricsToShow.map((metric, index) => (
            <div key={`${playerTrainingId}-${metric.id}`} className="relative">
              {index > 0 && <div className="absolute -top-3 left-1/2 w-px h-6 bg-gray-200 transform -translate-x-1/2" />}              <MetricInputField
                key={`${playerTrainingId}-${metric.id}-input`}
                metric={metric}
                value={metricValues[metric.id] || ""}
                onChange={(value) => onMetricChange(metric.id, value)}
                notes={notes[metric.id] || ""}
                onNotesChange={(noteValue) => onNotesChange(metric.id, noteValue)}
                playerTrainingId={playerTrainingId}
                fetchImprovement={fetchImprovement}
                getImprovementData={getImprovementData}
              />
            </div>
          ))}
        </div>
        
        {/* Completion Message */}
        {completedMetrics === metricsToShow.length && metricsToShow.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="text-center">
              <div className="text-green-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">All Metrics Recorded!</h3>
              <p className="text-sm text-green-700">
                Great job! All performance metrics have been captured for this player.
              </p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MetricsRecordingForm;
