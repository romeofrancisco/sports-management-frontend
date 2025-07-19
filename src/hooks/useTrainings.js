import { useQuery, useMutation, useQueries } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";
import {
  fetchTrainingCategories,
  fetchTrainingCategory,
  createTrainingCategory,
  updateTrainingCategory,
  deleteTrainingCategory,
  fetchTrainingMetrics,
  fetchTrainingMetric,
  createTrainingMetric,
  updateTrainingMetric,
  deleteTrainingMetric,
  fetchTrainingSessions,
  fetchTrainingSession,
  createTrainingSession,
  updateTrainingSession,
  deleteTrainingSession,
  addPlayersToSession,
  fetchSessionAnalytics,
  startTrainingSession,
  endTrainingSession,
  fetchPlayerTrainings,
  fetchPlayerTraining,
  createPlayerTraining,
  updatePlayerTraining,
  deletePlayerTraining,
  recordPlayerMetrics,
  fetchPreviousRecords,
  fetchPreviousRecordForMetric,
  fetchPlayerProgress,
  fetchPlayerProgressById,
  fetchMultiPlayerProgress,
  updatePlayerAttendance,
  bulkUpdateAttendance,
  assignMetricsToSession,
  assignMetricsToPlayerTraining,
  assignMetricsToPlayersInSession,
  getPlayerRadarChartData,
  assignMetricsToSinglePlayer,
  fetchLastSessionMissedMetrics,
  fetchTrainingOverview,
} from "@/api/trainingsApi";

// Training Categories
export const useTrainingCategories = (enabled = true) => {
  return useQuery({
    queryKey: ["training-categories"],
    queryFn: fetchTrainingCategories,
    enabled,
  });
};

export const useTrainingCategory = (id, enabled = true) => {
  return useQuery({
    queryKey: ["training-category", id],
    queryFn: () => fetchTrainingCategory(id),
    enabled: enabled && !!id,
  });
};

export const useCreateTrainingCategory = () => {
  return useMutation({
    mutationFn: createTrainingCategory,
    onSuccess: (data) => {
      toast.success("Category created successfully!", {
        description: `${data.name} category has been created.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-categories"]);
    },
    onError: (error) => {
      toast.error("Failed to create category", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

export const useUpdateTrainingCategory = () => {
  return useMutation({
    mutationFn: updateTrainingCategory,
    onSuccess: (data) => {
      toast.success("Category updated successfully!", {
        description: `${data.name} has been updated.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-categories"]);
      queryClient.invalidateQueries(["training-category", data.id]);
    },
    onError: (error) => {
      toast.error("Failed to update category", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

export const useDeleteTrainingCategory = () => {
  return useMutation({
    mutationFn: deleteTrainingCategory,
    onSuccess: (_, id) => {
      toast.info("Category deleted", {
        description: `The category has been deleted.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-categories"]);
    },
    onError: (error) => {
      toast.error("Failed to delete category", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

// Training Metrics
export const useTrainingMetrics = (categoryId = null, enabled = true) => {
  const params = useMemo(
    () => (categoryId ? { category: categoryId } : {}),
    [categoryId]
  );

  return useQuery({
    queryKey: ["training-metrics", params],
    queryFn: () => fetchTrainingMetrics(params),
    enabled,
  });
};

// Hook to get metrics associated with a specific session
export const useSessionMetrics = (sessionId, enabled = true) => {
  const params = useMemo(
    () => (sessionId ? { session: sessionId } : {}),
    [sessionId]
  );

  return useQuery({
    queryKey: ["session-metrics", params],
    queryFn: () => fetchTrainingMetrics(params),
    enabled: enabled && !!sessionId,
  });
};

export const useTrainingMetric = (id, enabled = true) => {
  return useQuery({
    queryKey: ["training-metric", id],
    queryFn: () => fetchTrainingMetric(id),
    enabled: enabled && !!id,
  });
};

export const useCreateTrainingMetric = () => {
  return useMutation({
    mutationFn: createTrainingMetric,
    onSuccess: (data) => {
      toast.success("Metric created successfully!", {
        description: `${data.name} metric has been created.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-metrics"]);
    },
    onError: (error) => {
      toast.error("Failed to create metric", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

export const useUpdateTrainingMetric = () => {
  return useMutation({
    mutationFn: updateTrainingMetric,
    onSuccess: (data) => {
      toast.success("Metric updated successfully!", {
        description: `${data.name} has been updated.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-metrics"]);
      queryClient.invalidateQueries(["training-metric", data.id]);
    },
    onError: (error) => {
      toast.error("Failed to update metric", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

export const useDeleteTrainingMetric = () => {
  return useMutation({
    mutationFn: deleteTrainingMetric,
    onSuccess: (_, id) => {
      toast.info("Metric deleted", {
        description: `The metric has been deleted.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-metrics"]);
    },
    onError: (error) => {
      toast.error("Failed to delete metric", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

// Training Sessions
export const useTrainingSessions = (
  filters = {},
  currentPage = 1,
  pageSize = 10
) => {
  // No more filter cleaning here, just pass as-is
  const params = useMemo(
    () => ({
      ...filters,
      page: currentPage,
      page_size: pageSize,
    }),
    [filters, currentPage, pageSize]
  );

  return useQuery({
    queryKey: ["training-sessions", params],
    queryFn: () => fetchTrainingSessions(params),
  });
};

export const useTrainingSession = (id, enabled = true) => {
  return useQuery({
    queryKey: ["training-session", id],
    queryFn: () => fetchTrainingSession(id),
    enabled: enabled && !!id,
  });
};

export const useCreateTrainingSession = () => {
  return useMutation({
    mutationFn: createTrainingSession,
    onSuccess: (data) => {
      toast.success("Training session created successfully!", {
        description: `${data.title} has been scheduled.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-sessions"]);
    },
    onError: (error) => {
      toast.error("Failed to create training session", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

export const useUpdateTrainingSession = () => {
  return useMutation({
    mutationFn: updateTrainingSession,
    onSuccess: (data) => {
      toast.success("Training session updated!", {
        description: `${data.title} has been updated.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-sessions"]);
      queryClient.invalidateQueries(["training-session", data.session_id]);
    },
    onError: (error) => {
      toast.error("Failed to update training session", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

export const useDeleteTrainingSession = () => {
  return useMutation({
    mutationFn: deleteTrainingSession,
    onSuccess: (_, id) => {
      toast.info("Training session deleted", {
        description: `The training session has been deleted.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-sessions"]);
    },
    onError: (error) => {
      toast.error("Failed to delete training session", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

export const useStartTrainingSession = () => {
  return useMutation({
    mutationFn: startTrainingSession,
    onSuccess: (data, sessionId) => {
      toast.success("Training session started!", {
        description: `${data.session_title || "Session"} is now ongoing.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-sessions"]);
      queryClient.invalidateQueries(["training-session", sessionId]);
    },
    onError: (error) => {
      toast.error("Failed to start training session", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

export const useEndTrainingSession = () => {
  return useMutation({
    mutationFn: endTrainingSession,
    onSuccess: (data, sessionId) => {
      toast.success("Training session ended!", {
        description: `${data.session_title || "Session"} has been completed.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-sessions"]);
      queryClient.invalidateQueries(["training-session", sessionId]);
    },
    onError: (error) => {
      toast.error("Failed to end training session", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

export const useAddPlayersToSession = () => {
  return useMutation({
    mutationFn: addPlayersToSession,
    onSuccess: (data, { id }) => {
      toast.success("Players added to training session", {
        description: `${data.players_added} players have been added to the session.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-session", id]);
    },
  });
};

export const useSessionAnalytics = (id, enabled = true) => {
  return useQuery({
    queryKey: ["session-analytics", id],
    queryFn: () => fetchSessionAnalytics(id),
    enabled: enabled && !!id,
  });
};

// Player Trainings
export const usePlayerTrainings = (filters = {}) => {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["player-trainings", filters],
    queryFn: () => fetchPlayerTrainings(filters),
  });

  return {
    trainings: data,
    isLoading,
    error,
  };
};

export const usePlayerTraining = (id, enabled = true) => {
  return useQuery({
    queryKey: ["player-training", id],
    queryFn: () => fetchPlayerTraining(id),
    enabled: enabled && !!id,
  });
};

export const useCreatePlayerTraining = () => {
  return useMutation({
    mutationFn: createPlayerTraining,
    onSuccess: (data) => {
      toast.success("Player training record created", {
        richColors: true,
      });
      queryClient.invalidateQueries(["player-trainings"]);
    },
  });
};

export const useUpdatePlayerTraining = () => {
  return useMutation({
    mutationFn: updatePlayerTraining,
    onSuccess: (data, { id }) => {
      toast.success("Player training record updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["player-trainings"]);
      queryClient.invalidateQueries(["player-training", id]);
    },
  });
};

export const useDeletePlayerTraining = () => {
  return useMutation({
    mutationFn: deletePlayerTraining,
    onSuccess: (_, id) => {
      toast.info("Player training record deleted", {
        richColors: true,
      });
      queryClient.invalidateQueries(["player-trainings"]);
    },
  });
};

export const useRecordPlayerMetrics = (sessionId) => {
  return useMutation({
    mutationFn: recordPlayerMetrics,
    onSuccess: (data, { id, sessionId: mutationSessionId }) => {
      toast.success("Player metrics recorded!", {
        description: `Successfully recorded ${
          data.records?.length || 0
        } metrics for the player`,
        richColors: true,
      });

      // Use the sessionId from the mutation payload or the hook parameter
      const currentSessionId = mutationSessionId || sessionId;

      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries(["player-training", id]);
      queryClient.invalidateQueries(["session-players-with-metrics", currentSessionId]);
      queryClient.invalidateQueries(["training-session", currentSessionId]);
      queryClient.invalidateQueries(["current-player"]);
      queryClient.invalidateQueries(["player-metrics"]);
      
      // Force refetch to ensure immediate UI updates
      queryClient.refetchQueries(["session-players-with-metrics", currentSessionId]);
      queryClient.refetchQueries(["training-session", currentSessionId]);
    },
    onError: (error) => {
      toast.error("Failed to record metrics", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

export const usePreviousPlayerMetrics = (playerTrainingId) => {
  return useQuery({
    queryKey: ["player-training-previous", playerTrainingId],
    queryFn: async () => {
      if (!playerTrainingId) return [];

      try {
        // First check if we have this in cache from a previous recording
        const cachedData = queryClient.getQueryData([
          "player-training-previous",
          playerTrainingId,
        ]);
        if (cachedData) return cachedData;

        // Use the dedicated API function instead of direct fetch
        return await fetchPreviousRecords(playerTrainingId);
      } catch (error) {
        console.error("Error fetching previous records:", error);
        return [];
      }
    },
    enabled: !!playerTrainingId,
  });
};

// Player Progress
export const usePlayerProgress = (filters = {}) => {
  const {
    data: playerProgress = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["player-progress", filters],
    queryFn: () => fetchPlayerProgress(filters),
  });

  // Transform data for charts
  const chartData = useMemo(() => {
    return playerProgress.map((player) => {
      const metricsData = {};

      player.metrics_data?.forEach((metric) => {
        const metricName = metric.metric_name;

        if (!metricsData[metricName]) {
          metricsData[metricName] = {
            name: metricName,
            unit: metric.metric_unit?.code || "-",
            data: [],
          };
        }

        metric.historical_data?.forEach((record) => {
          metricsData[metricName].data.push({
            date: record.date,
            value: record.value,
          });
        });
      });

      return {
        playerId: player.player_id,
        playerName: player.player_name,
        metrics: Object.values(metricsData),
      };
    });
  }, [playerProgress]);

  return {
    playerProgress,
    chartData,
    isLoading,
    error,
  };
};

export const usePlayerProgressById = (id, filters = {}, enabled = true) => {
  const params = useMemo(() => ({ id, ...filters }), [id, filters]);

  return useQuery({
    queryKey: ["player-progress-by-id", params],
    queryFn: () => fetchPlayerProgressById(params),
    enabled: enabled && !!id,
  });
};

// New hook to fetch progress data for multiple players simultaneously
export const usePlayersProgressById = (
  players = [],
  filters = {},
  enabled = true
) => {
  const playerQueries = useQueries({
    queries: players.map((player) => {
      const params = { id: player.user_id, ...filters };

      return {
        queryKey: ["player-progress-by-id", params],
        queryFn: () => fetchPlayerProgressById(params),
        enabled: enabled && !!player.user_id,
      };
    }),
  });

  // Transform query results into a player-id mapped object
  const playerData = useMemo(() => {
    const data = {};

    players.forEach((player, index) => {
      if (playerQueries[index].data) {
        data[player.user_id] = playerQueries[index].data;
      }
    });

    return data;
  }, [players, playerQueries]);

  // Determine if any query is loading
  const isLoading = playerQueries.some((query) => query.isLoading);
  const isFetching = playerQueries.some((query) => query.isFetching);
  return {
    playerData,
    queries: playerQueries,
    isLoading,
    isFetching,
  };
};

// Export the optimized multi-player progress hook from the dedicated file
export { useMultiPlayerProgress } from "./useMultiPlayerProgress";

export const useUpdatePlayerAttendance = () => {
  return useMutation({
    mutationFn: (data) => {
      // If passing a session ID with player records, use the bulk endpoint
      if (data.playerRecords && data.sessionId) {
        return bulkUpdateAttendance({
          sessionId: data.sessionId,
          playerRecords: data.playerRecords,
        });
      }
      // For single record update with attendance status and notes
      if (typeof data === "object" && data.id) {
        return updatePlayerAttendance({
          trainingId: data.id,
          attendance_status: data.attendance_status,
          notes: data.notes,
        });
      }
      // Legacy case - just update status with ID
      return updatePlayerAttendance({
        trainingId: data,
        attendance_status: "present",
      });
    },
    onSuccess: (data) => {
      const count = data?.updated_count || "all";
      toast.success(`Attendance updated successfully`, {
        description: `Updated ${count} player records`,
        richColors: true,
      });
      queryClient.invalidateQueries({ queryKey: ["training-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["player-trainings"] });
    },
    onError: (error) => {
      console.error("Attendance update error:", error.response?.data || error);
      toast.error(
        error.response?.data?.detail || "Failed to update attendance",
        { richColors: true }
      );
    },
  });
};

// Hook to assign metrics to a specific session
export const useAssignSessionMetrics = () => {
  return useMutation({
    mutationFn: assignMetricsToSession,
    onSuccess: (data) => {
      toast.success("Session metrics configured successfully!", {
        description: `${
          data.count || 0
        } metrics have been assigned to this session.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["training-sessions"]);
      queryClient.invalidateQueries(["session-metrics"]);
    },
    onError: (error) => {
      toast.error("Failed to configure session metrics", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

// Hook to assign metrics to a specific player's training
export const useAssignPlayerTrainingMetrics = (sessionId) => {
  return useMutation({
    mutationFn: assignMetricsToPlayerTraining,
    onSuccess: async (data, variables) => {
      toast.success("Player metrics configured successfully!", {
        description: `${
          data.count || 0
        } metrics have been assigned to this player.`,
        richColors: true,
      });

      // Invalidate training sessions to refresh the UI
      queryClient.invalidateQueries(["training-sessions"]);

      // Invalidate the specific session if we have a sessionId
      if (sessionId) {
        queryClient.invalidateQueries(["training-session", sessionId]);
      }

      // Invalidate player trainings to refresh any player-specific data
      queryClient.invalidateQueries(["player-trainings"]);

      // Invalidate player progress data that might depend on these metrics
      queryClient.invalidateQueries(["player-progress"]);
    },
    onError: (error) => {
      toast.error("Failed to configure player metrics", {
        description: error.response?.data?.detail || error.message,
        richColors: true,
      });
    },
  });
};

// Hook to assign metrics to specific players in a session
export const useAssignMetricsToPlayersInSession = () => {
  return useMutation({
    mutationFn: assignMetricsToPlayersInSession,    onSuccess: async (data, variables) => {
      const total_added = data.total_metrics_added || 0;
      const total_removed = data.total_metrics_removed || 0;
      const players_processed = data.total_players_processed || 0;

      let description = "";
      if (total_added > 0 && total_removed > 0) {
        description = `${total_added} metrics added, ${total_removed} metrics removed across ${players_processed} players.`;
      } else if (total_added > 0) {
        description = `${total_added} metrics added to ${players_processed} players.`;
      } else if (total_removed > 0) {
        description = `${total_removed} metrics removed from ${players_processed} players.`;
      } else {
        description = `${players_processed} players processed.`;
      }

      toast.success("Player metrics updated successfully!", {
        description: description,
        richColors: true,
      });

      // Invalidate training sessions to refresh the UI
      queryClient.invalidateQueries(["training-sessions"]);

      // Invalidate the specific session
      if (variables.sessionId) {
        queryClient.invalidateQueries([
          "training-session",
          variables.sessionId.toString(),
        ]);
      }

      // Invalidate player trainings to refresh any player-specific data
      queryClient.invalidateQueries(["player-trainings"]);
    },    onError: (error) => {
      const errorMessage =
        error.response?.data?.detail || "Failed to assign metrics to players";
      toast.error("Error assigning metrics", {
        description: errorMessage,
        richColors: true,
      });
    },
  });
};

// Hook to assign metrics to a single player in a session
export const useAssignMetricsToSinglePlayer = () => {
  return useMutation({
    mutationFn: ({ sessionId, playerId, metricIds }) => {
      return assignMetricsToSinglePlayer({ sessionId, playerId, metricIds });
    },    onSuccess: async (data, variables) => {

      toast.success("Metrics Configuration Updated", {
        description: data.detail || "Player metrics assigned successfully.",
        richColors: true,
      });

      // Invalidate training sessions to refresh the UI
      queryClient.invalidateQueries(["training-sessions"]);

      // Invalidate the specific session
      if (variables.sessionId) {
        queryClient.invalidateQueries([
          "training-session",
          variables.sessionId.toString(),
        ]);
      }

      // Invalidate player trainings to refresh any player-specific data
      queryClient.invalidateQueries(["player-trainings"]);
    },    onError: (error) => {
      const errorMessage =
        error.response?.data?.detail || "Unable to update player metrics. Please try again.";
      toast.error("Metrics Configuration Failed", {
        description: errorMessage,
        richColors: true,
      });
    },
  });
};

// Player Radar Chart Hook
export const usePlayerRadarChart = (
  playerId,
  dateRange = {},
  enabled = true
) => {
  // For "Overall" selection, dateRange is {from: null, to: null}
  // For other selections, dateRange has actual date values
  const effectiveDateRange = dateRange !== null ? dateRange : {};
  
  return useQuery({
    queryKey: ["player-radar-chart", playerId, effectiveDateRange],
    queryFn: async () => {
      const { getPlayerRadarChartData } = await import("@/api/trainingsApi");
      return getPlayerRadarChartData(playerId, effectiveDateRange);
    },
    enabled: enabled && !!playerId,
  });
};

// Hook to fetch training summaries for completed sessions
export const useTrainingSummary = (sessionId, enabled = true) => {
  return useQuery({
    queryKey: ["training-summary", sessionId],
    queryFn: async () => {
      const { fetchTrainingSummary } = await import("@/api/trainingsApi");
      return fetchTrainingSummary(sessionId);
    },
    enabled: enabled && !!sessionId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

// Hook to fetch last session's missed metrics for a team
export const useLastSessionMissedMetrics = (teamId, currentSessionId = null) => {
  return useQuery({
    queryKey: ["last-session-missed-metrics", teamId, currentSessionId],
    queryFn: async () => {
      const { fetchLastSessionMissedMetrics } = await import("@/api/trainingsApi");
      return fetchLastSessionMissedMetrics(teamId, currentSessionId);
    },
    enabled: !!teamId,
  });
};

// Hook to fetch training overview statistics for the current player
export const useTrainingOverview = (enabled = true) => {
  return useQuery({
    queryKey: ["training-overview"],
    queryFn: fetchTrainingOverview,
    enabled,
  });
};

// Hook to fetch assigned metrics detail for the current player
export const useAssignedMetricsDetail = (params = {}, enabled = true) => {
  const queryParams = useMemo(() => ({
    page: 1,
    page_size: 10,
    ...params,
  }), [params]);

  return useQuery({
    queryKey: ["assigned-metrics-detail", queryParams],
    queryFn: async () => {
      const { fetchAssignedMetricsDetail } = await import("@/api/trainingsApi");
      return fetchAssignedMetricsDetail(queryParams);
    },
    enabled,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute
  });
};

// Hook to fetch assigned metrics overview summary
export const useAssignedMetricsOverview = (enabled = true) => {
  return useQuery({
    queryKey: ["assigned-metrics-overview"],
    queryFn: async () => {
      const { fetchAssignedMetricsOverview } = await import("@/api/trainingsApi");
      return fetchAssignedMetricsOverview();
    },
    enabled,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes since overview changes less frequently
  });
};
