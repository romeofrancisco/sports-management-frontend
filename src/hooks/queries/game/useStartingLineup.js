import { useQuery } from "@tanstack/react-query";
import { fetchStartingLineup } from "@/api/gamesApi";

export const useStartingLineup = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["starting-lineup", gameId],
    queryFn: () => fetchStartingLineup(gameId),
    enabled,
  });
};
