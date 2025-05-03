import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createPlayerStat,
  fetchPlayerStatsSummary,
  fetchStatTypeChoices,
  fetchTeamStatsSummary,
  fetchTeamStatsComparison,
  fetchBoxscore,
} from "@/api/statsApi";
import { reset } from "@/store/slices/playerStatSlice";
import { useDispatch } from "react-redux";
import {
  createSportStats,
  deleteSportStat,
  fetchSportStats,
  updateSportStats,
} from "@/api/sportsApi";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

export const useCreatePlayerStat = (gameId) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (stat) => createPlayerStat(stat),

    onMutate: async (newStat) => {
      const { point_value, team } = newStat;

      dispatch(reset());

      await queryClient.cancelQueries(["game-details", gameId]);

      const previousGame = queryClient.getQueryData(["game-details", gameId]);

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
    enabled: Boolean(gameId) && Boolean(gameId),
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
}

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
