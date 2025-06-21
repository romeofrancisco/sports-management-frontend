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
  deleteSportStat,
  fetchSportStats,
  updateSportStats,
} from "@/api/sportsApi";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

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
      if (response.data.error) {
        toast.info("Cannot Record Stat", {
          description: response.data.error,
          richColors: true,
        });
      }
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

export const useSportStats = (sport, filter) => {
  return useQuery({
    queryKey: ["sport-stats", sport, filter],
    queryFn: () => fetchSportStats(sport, filter),
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
    onSuccess: () => {
      toast.info("Stat Deleted", {
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
      const errorMessage = error?.response?.data?.error || "Failed to undo stat";
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
      if (response.data.error) {
        toast.info("Cannot Record Stat", {
          description: response.data.error,
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
      
      statsArray.forEach(stat => {
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
        toast.error("Bulk Recording Failed", {
          description: response.data.error,
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
      
      statsArray.forEach(stat => {
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
        toast.error("Optimized Bulk Recording Failed", {
          description: response.data.error,
          richColors: true,
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["game-details", gameId]);
    },
  });
};
