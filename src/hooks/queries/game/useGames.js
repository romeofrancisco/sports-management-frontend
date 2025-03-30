import { useQuery } from "@tanstack/react-query";
import { fetchGames } from "@/api/gamesApi";

export const useGames = (enabled = true) => {
  return useQuery({
    queryKey: ["games"],
    queryFn: fetchGames,
    enabled,
  });
};
