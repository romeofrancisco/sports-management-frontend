import React from "react";
import { BarChart3 } from "lucide-react";
import Modal from "@/components/common/Modal";

const ChartSummaryModal = ({
  open,
  onOpenChange,
  title,
  isLoading,
  error,
  analysis,
  summaryLines,
  description = "Detailed analysis and insights based on the selected chart data",
  icon = BarChart3,
}) => {
  const insights = Array.isArray(analysis?.insights) ? analysis.insights : [];
  const recommendations = Array.isArray(analysis?.recommendations)
    ? analysis.recommendations
    : [];
  const possibleOutcomes = Array.isArray(analysis?.possibleOutcomes)
    ? analysis.possibleOutcomes
    : [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      icon={icon}
      isLoading={isLoading}
    >
      {!isLoading && error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-3 text-sm text-foreground">
          {insights.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-primary">Insights</h4>
              <div className="mt-2 space-y-2">
                {insights.map((line, index) => (
                  <p key={`${title}-insight-${index}`}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-primary">
                Recommendations
              </h4>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {recommendations.map((line, index) => (
                  <li key={`${title}-recommendation-${index}`}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {possibleOutcomes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-primary">
                Possible Outcomes
              </h4>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {possibleOutcomes.map((line, index) => (
                  <li key={`${title}-outcome-${index}`}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {insights.length === 0 &&
            recommendations.length === 0 &&
            possibleOutcomes.length === 0 &&
            summaryLines.map((line, index) => (
              <p key={`${title}-summary-${index}`}>{line}</p>
            ))}
        </div>
      )}
    </Modal>
  );
};

export default ChartSummaryModal;
