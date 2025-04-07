import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createPlayerStat,
  fetchPlayerSummaryStats,
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

export const usePlayerSummaryStats = (gameId, team, enabled = true) => {
  return useQuery({
    queryKey: ["player-summary-stats", team, gameId],
    queryFn: () => fetchPlayerSummaryStats(gameId, team),
    enabled,
  });
};
