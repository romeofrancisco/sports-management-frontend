import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";
import api from "@/api";
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
  fetchPlayerTrainings,
  fetchPlayerTraining,
  createPlayerTraining,
  updatePlayerTraining,
  deletePlayerTraining,
  recordPlayerMetrics,
  fetchPlayerProgress,
  fetchPlayerProgressById,
  fetchTeamTrainingAnalytics,
  fetchTeamTrainingAnalyticsById,
  updatePlayerAttendance,
  bulkUpdateAttendance,
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

export const useRecordPlayerMetrics = () => {
  return useMutation({
    mutationFn: recordPlayerMetrics,
    onSuccess: (data, { id }) => {
      toast.success("Player metrics recorded", {
        description: `${data.records.length} metrics have been recorded.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["player-training", id]);
      queryClient.invalidateQueries(["player-progress"]);
    },
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
            unit: metric.unit,
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

// Team Analytics
export const useTeamTrainingAnalytics = (filters = {}) => {
  return useQuery({
    queryKey: ["team-training-analytics", filters],
    queryFn: () => fetchTeamTrainingAnalytics(filters),
  });
};

export const useTeamTrainingAnalyticsById = (
  id,
  filters = {},
  enabled = true
) => {
  const params = useMemo(() => ({ id, ...filters }), [id, filters]);

  return useQuery({
    queryKey: ["team-training-analytics-by-id", params],
    queryFn: () => fetchTeamTrainingAnalyticsById(params),
    enabled: enabled && !!id,
  });
};

export const useUpdatePlayerAttendance = () => {
  return useMutation({
    mutationFn: (data) => {
      // If passing a session ID with player records, use the bulk endpoint
      if (data.playerRecords && data.sessionId) {
        return bulkUpdateAttendance({
          sessionId: data.sessionId,
          playerRecords: data.playerRecords
        });
      }
      // For single record update with attendance status and notes
      if (typeof data === 'object' && data.id) {
        return updatePlayerAttendance({
          trainingId: data.id,
          attendance_status: data.attendance_status,
          notes: data.notes
        });
      }
      // Legacy case - just update status with ID
      return updatePlayerAttendance({
        trainingId: data,
        attendance_status: 'present'
      });
    },
    onSuccess: (data) => {
      const count = data?.updated_count || 'all';
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
