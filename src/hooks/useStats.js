import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createPlayerStat,
  fetchPlayerStatsSummary,
  fetchTeamStatsSummary,
} from "@/api/statsApi";
import { reset } from "@/store/slices/playerStatSlice";
import { useDispatch } from "react-redux";

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
