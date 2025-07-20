import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRecordPlayerMetrics } from "@/hooks/useTrainings";
import { toast } from "sonner";

/**
 * Hook for handling save operations
 */
export const useSaveOperations = (
  session,
  currentPlayer,
  metricsToShow,
  metricValues,
  notes,
  hasActualChanges,
  onSessionUpdate,
  refetchCurrentPlayerData,
  hasZeroValues = false
) => {
  const queryClient = useQueryClient();
  const { mutate: recordMetrics, isPending } = useRecordPlayerMetrics(
    session?.id
  );


  const savePlayerMetrics = useCallback(
    async (shouldNavigate = false, skipChangeCheck = false) => {
      if (!skipChangeCheck && !hasActualChanges) {
        toast.info("No changes detected", {
          description:
            "Metrics and notes are unchanged from the last recording.",
        });
        return { saved: false, reason: "no_changes" };
      }

      // Prevent saving if there are zero values
      if (hasZeroValues) {
        toast.error("Cannot save with zero values", {
          description:
            "Zero (0) values are not allowed for performance metrics. Please enter valid positive values or clear the fields completely.",
        });
        return { saved: false, reason: "zero_values" };
      }

      const metricsData = metricsToShow
        .map((metric) => ({
          metric_id: metric.id,
          value: metricValues[metric.id] || null,
          notes: notes[metric.id] || "",
          record_id: metric.existing_record_id,
        }))

      if (metricsData.length === 0) {
        return { saved: false, reason: "no_valid_metrics" };
      }

      // If skipChangeCheck is true but there are no actual changes, don't save
      if (skipChangeCheck && !hasActualChanges) {
        return { saved: false, reason: "no_changes_skip_check" };
      }

      recordMetrics(
        {
          id: currentPlayer.id,
          metrics: metricsData,
          sessionId: session?.id,
        },
      );
    },
    [
      hasActualChanges,
      metricsToShow,
      metricValues,
      notes,
      currentPlayer,
      recordMetrics,
      queryClient,
      session?.id,
      onSessionUpdate,
      refetchCurrentPlayerData,
      hasZeroValues,
    ]
  );

  return {
    savePlayerMetrics,
    isSaving: isPending,
  };
};
