import { useQuery } from "@tanstack/react-query";
import { fetchRecordableStats } from "@/api/sportsApi";

export const useRecordableStats = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["recordable-stats", gameId],
    queryFn: () => fetchRecordableStats(gameId),
    enabled,
  });
};
