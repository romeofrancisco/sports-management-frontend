import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createPlayerStat,
  fetchPlayerStatsSummary,
  fetchStatTypeChoices,
  fetchTeamStatsSummary,
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

export const useCreatePlayerStat = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (stats) => createPlayerStat(stats),
    onSettled: () => {
      dispatch(reset());
    },
  });
};

export const usePlayerStatsSummary = (gameId, team, enabled = true) => {
  return useQuery({
    queryKey: ["player-summary-stats", team, gameId],
    queryFn: () => fetchPlayerStatsSummary(gameId, team),
    enabled,
  });
};

export const useTeamStatsSummary = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["team-summary-stats", gameId],
    queryFn: () => fetchTeamStatsSummary(gameId),
    enabled,
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
