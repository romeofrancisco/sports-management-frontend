import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPlayerStat,
  createPlayerStatFast,
  bulkCreatePlayerStats,
  bulkCreatePlayerStatsOptimized,
  fetchPlayerStatsSummary,
  fetchStatTypeChoices,
  fetchTeamStatsSummary,
  fetchTeamStatsComparison,
  fetchBoxscore,
  undoLastStat,
} from "@/api/statsApi";
import {
  createSportStats,
  createStatCategory,
  deleteSportStat,
  deleteStatCategories,
  fetchSportStats,
  fetchSportStatsOverview,
  fetchStatCategories,
  updateSportStats,
  updateStatCategory,
  reactivateSportStat,
} from "@/api/sportsApi";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

// Helper function to extract error message from Django REST Framework response
const extractErrorMessage = (
  response,
  defaultMessage = "An error occurred"
) => {
  if (!response?.data) return defaultMessage;

  const data = response.data;

  // Check for direct string error
  if (typeof data === "string") {
    // Handle string representation of ErrorDetail array like "[ErrorDetail(string='...', code='invalid')]"
    if (data.includes("ErrorDetail(string=")) {
      const match = data.match(/ErrorDetail\(string='([^']+)'/);
      if (match) {
        return match[1];
      }
    }
    return data;
  }

  // Check for error field (string)
  if (typeof data.error === "string") {
    // Handle case where error is a string representation of ErrorDetail array
    if (data.error.includes("ErrorDetail(string=")) {
      const match = data.error.match(/ErrorDetail\(string='([^']+)'/);
      if (match) {
        return match[1];
      }
    }
    return data.error;
  }

  // Check for detail field
  if (data.detail) {
    // Handle detail field that might be an ErrorDetail object or string representation
    if (
      typeof data.detail === "string" &&
      data.detail.includes("ErrorDetail(string=")
    ) {
      const match = data.detail.match(/ErrorDetail\(string='([^']+)'/);
      if (match) {
        return match[1];
      }
    }
    // Handle ErrorDetail object
    if (typeof data.detail === "object" && data.detail.string) {
      return data.detail.string;
    }
    return data.detail;
  }

  // Check for message field
  if (data.message) {
    return data.message;
  }

  // Handle non_field_errors array (common Django format)
  if (
    Array.isArray(data.non_field_errors) &&
    data.non_field_errors.length > 0
  ) {
    const firstError = data.non_field_errors[0];
    // Handle ErrorDetail objects
    if (typeof firstError === "object" && firstError.string) {
      return firstError.string;
    } else if (typeof firstError === "string") {
      // Handle string representation of ErrorDetail
      if (firstError.includes("ErrorDetail(string=")) {
        const match = firstError.match(/ErrorDetail\(string='([^']+)'/);
        if (match) {
          return match[1];
        }
      }
      return firstError;
    }
  }

  // Handle direct array of ErrorDetail objects (when ValidationError is raised with string)
  if (Array.isArray(data) && data.length > 0) {
    const firstError = data[0];
    // Handle ErrorDetail objects
    if (typeof firstError === "object" && firstError.string) {
      return firstError.string;
    } else if (typeof firstError === "string") {
      // Handle string representation of ErrorDetail
      if (firstError.includes("ErrorDetail(string=")) {
        const match = firstError.match(/ErrorDetail\(string='([^']+)'/);
        if (match) {
          return match[1];
        }
      }
      return firstError;
    }
  }

  return defaultMessage;
};

export const useRecordStat = (gameId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlayerStat,

    onMutate: async (newStat) => {
      const { game, player, team, stat_type, period, point_value } = newStat;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["game-details", gameId],
        exact: true,
      });

      // Snapshot the previous value
      const previousGame = queryClient.getQueryData(["game-details", gameId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["game-details", gameId], (old) => {
        if (!old) return old;

        const newHomeScore =
          old.home_team_score + (team === old.home_team.id ? point_value : 0);
        const newAwayScore =
          old.away_team_score + (team === old.away_team.id ? point_value : 0);

        return {
          ...old,
          home_team_score: newHomeScore,
          away_team_score: newAwayScore,
        };
      });
      return { previousGame }; // for rollback if needed
    },

    onError: ({ response }, newStat, context) => {
      if (context?.previousGame) {
        queryClient.setQueryData(
          ["game-details", gameId],
          context.previousGame
        );
      }
      const errorMessage = extractErrorMessage(response, "Cannot record stat");
      toast.info("Cannot Record Stat", {
        description: errorMessage,
        richColors: true,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["game-details", gameId]);
    },
  });
};

export const usePlayerStatsSummary = (gameId, team) => {
  return useQuery({
    queryKey: ["player-summary-stats", team, gameId],
    queryFn: () => fetchPlayerStatsSummary(gameId, team),
    enabled: Boolean(gameId) && Boolean(team),
  });
};

export const useTeamStatsSummary = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["team-summary-stats", gameId],
    queryFn: () => fetchTeamStatsSummary(gameId),
    enabled,
  });
};

export const useTeamStatsComparison = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["team-comparison-stats", gameId],
    queryFn: () => fetchTeamStatsComparison(gameId),
    enabled: Boolean(gameId) && enabled,
  });
};

export const useBoxscore = (gameId) => {
  return useQuery({
    queryKey: ["box-score", gameId],
    queryFn: () => fetchBoxscore(gameId),
    enabled: Boolean(gameId),
  });
};

export const useStatCategories = (filter) => {
  return useQuery({
    queryKey: ["stat-categories", filter],
    queryFn: () => fetchStatCategories(filter),
  });
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: (data) => createStatCategory(data),
    onSuccess: (data) => {
      toast.success(`Category Created: ${data.name}`, {
        richColors: true,
      });
      queryClient.invalidateQueries(["stat-categories"]);
    },
  });
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: ({ id, data }) => updateStatCategory(id, data),
    onSuccess: (data) => {
      toast.success(`Category Updated: ${data.name}`, {
        richColors: true,
      });
      queryClient.invalidateQueries(["stat-categories"]);
    },
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: (id) => deleteStatCategories(id),
    onSuccess: (data) => {
      toast.success(`Category Deleted: ${data.name}`, {
        richColors: true,
      });
      queryClient.invalidateQueries(["stat-categories"]);
    },
  });
};

export const useSportStats = (sport, filter) => {
  return useQuery({
    queryKey: ["sport-stats", sport, filter],
    queryFn: () => fetchSportStats(sport, filter),
    enabled: !!sport,
  });
};

export const useSportStatsOverview = (sport) => {
  return useQuery({
    queryKey: ["sport-stats-overview", sport],
    queryFn: () => fetchSportStatsOverview(sport),
    enabled: !!sport,
  });
};

export const useCreateSportStats = () => {
  return useMutation({
    mutationFn: (data) => createSportStats(data),
    onSuccess: () => {
      toast.success("Stat Created", {
        richColors: true,
      });
      queryClient.invalidateQueries(["sport-stats"]);
    },
  });
};

export const useDeleteSportStat = () => {
  return useMutation({
    mutationFn: ({ id }) => deleteSportStat(id),
    onSuccess: (data) => {
      if (data.status === 'deactivated') {
        toast.warning("Stat Deactivated", {
          description: "Stat has associated game data and was deactivated instead of deleted.",
          richColors: true,
        });
      } else {
        toast.info("Stat Deleted", {
          richColors: true,
        });
      }
      queryClient.invalidateQueries(["sport-stats"]);
    },
  });
};

export const useReactivateSportStat = () => {
  return useMutation({
    mutationFn: ({ id }) => reactivateSportStat(id),
    onSuccess: () => {
      toast.success("Stat Reactivated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["sport-stats"]);
    },
  });
};

export const useUpdateSportStats = () => {
  return useMutation({
    mutationFn: ({ id, data }) => updateSportStats(id, data),
    onSuccess: () => {
      toast.success("Stat Updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["sport-stats"]);
    },
  });
};

export const useUndoLastStat = (gameId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return undoLastStat(gameId);
    },

    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["game-details", gameId],
        exact: true,
      });

      // Snapshot the previous value for rollback
      const previousGame = queryClient.getQueryData(["game-details", gameId]);
      return { previousGame };
    },

    onSuccess: (data) => {
      // Show success message with details of what was undone
      toast.success("Stat Undone", {
        description: `Removed ${data.undone_stat.stat_type} for ${data.undone_stat.player_name}`,
        richColors: true,
      });
    },

    onError: (error, variables, context) => {
      // Rollback optimistic update if needed
      if (context?.previousGame) {
        queryClient.setQueryData(
          ["game-details", gameId],
          context.previousGame
        );
      }

      // Show error message
      const errorMessage =
        error?.response?.data?.error || "Failed to undo stat";
      toast.error("Error", {
        description: errorMessage,
        richColors: true,
      });
    },

    onSettled: () => {
      // Invalidate and refetch all related queries
      queryClient.invalidateQueries(["game-details", gameId]);
    },
  });
};

export const useRecordStatFast = (gameId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlayerStatFast,

    onMutate: async (newStat) => {
      const { game, player, team, stat_type, period, point_value } = newStat;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["game-details", gameId],
        exact: true,
      });

      // Snapshot the previous value
      const previousGame = queryClient.getQueryData(["game-details", gameId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["game-details", gameId], (old) => {
        if (!old) return old;

        const newHomeScore =
          old.home_team_score + (team === old.home_team.id ? point_value : 0);
        const newAwayScore =
          old.away_team_score + (team === old.away_team.id ? point_value : 0);

        return {
          ...old,
          home_team_score: newHomeScore,
          away_team_score: newAwayScore,
        };
      });

      return { previousGame };
    },

    onSuccess: (data) => {
      // toast.success("Stat Recorded (Fast)", {
      //   description: `Processing time: ${data.processing_time}`,
      //   richColors: true,
      // });
    },

    onError: ({ response }, newStat, context) => {
      if (context?.previousGame) {
        queryClient.setQueryData(
          ["game-details", gameId],
          context.previousGame
        );
      }
      if (response?.data?.error) {
        const errorMessage = extractErrorMessage(
          response,
          "Cannot record stat"
        );
        toast.info("Cannot Record Stat", {
          description: errorMessage,
          richColors: true,
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["game-details", gameId]);
    },
  });
};

export const useBulkRecordStats = (gameId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkCreatePlayerStats,

    onMutate: async (statsArray) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["game-details", gameId],
        exact: true,
      });

      // Snapshot the previous value
      const previousGame = queryClient.getQueryData(["game-details", gameId]);

      // Calculate total points for each team from the stats
      const homeTeamId = previousGame?.home_team?.id;
      const awayTeamId = previousGame?.away_team?.id;

      let homePoints = 0;
      let awayPoints = 0;

      statsArray.forEach((stat) => {
        const pointValue = stat.point_value || 0;
        if (stat.team === homeTeamId) {
          homePoints += pointValue;
        } else if (stat.team === awayTeamId) {
          awayPoints += pointValue;
        }
      });

      // Optimistically update scores
      queryClient.setQueryData(["game-details", gameId], (old) => {
        if (!old) return old;

        return {
          ...old,
          home_team_score: old.home_team_score + homePoints,
          away_team_score: old.away_team_score + awayPoints,
        };
      });

      return { previousGame };
    },

    onSuccess: (data) => {
      toast.success("Bulk Stats Recorded", {
        description: `${data.message} (${data.processing_time})`,
        richColors: true,
      });
    },

    onError: ({ response }, statsArray, context) => {
      if (context?.previousGame) {
        queryClient.setQueryData(
          ["game-details", gameId],
          context.previousGame
        );
      }
      if (response?.data?.error) {
        const errorMessage = extractErrorMessage(
          response,
          "Bulk recording failed"
        );
        toast.error("Bulk Recording Failed", {
          description: errorMessage,
          richColors: true,
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["game-details", gameId]);
    },
  });
};

export const useBulkRecordStatsOptimized = (gameId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkCreatePlayerStatsOptimized,

    onMutate: async (statsArray) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["game-details", gameId],
        exact: true,
      });

      // Snapshot the previous value
      const previousGame = queryClient.getQueryData(["game-details", gameId]);

      // Calculate total points for each team from the stats
      const homeTeamId = previousGame?.home_team?.id;
      const awayTeamId = previousGame?.away_team?.id;

      let homePoints = 0;
      let awayPoints = 0;

      statsArray.forEach((stat) => {
        const pointValue = stat.point_value || 0;
        if (stat.team === homeTeamId) {
          homePoints += pointValue;
        } else if (stat.team === awayTeamId) {
          awayPoints += pointValue;
        }
      });

      // Optimistically update scores
      queryClient.setQueryData(["game-details", gameId], (old) => {
        if (!old) return old;

        return {
          ...old,
          home_team_score: old.home_team_score + homePoints,
          away_team_score: old.away_team_score + awayPoints,
        };
      });

      return { previousGame };
    },

    onSuccess: (data) => {
      toast.success("Optimized Bulk Recording Complete", {
        description: `${data.message} (${data.processing_time})`,
        richColors: true,
      });
    },

    onError: ({ response }, statsArray, context) => {
      if (context?.previousGame) {
        queryClient.setQueryData(
          ["game-details", gameId],
          context.previousGame
        );
      }
      if (response?.data?.error) {
        const errorMessage = extractErrorMessage(
          response,
          "Optimized bulk recording failed"
        );
        toast.error("Optimized Bulk Recording Failed", {
          description: errorMessage,
          richColors: true,
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["game-details", gameId]);
    },
  });
};
