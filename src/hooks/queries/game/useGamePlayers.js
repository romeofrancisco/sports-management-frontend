import { useQuery } from "@tanstack/react-query";
import { fetchGamePlayers } from "@/api/gamesApi";

export const useGamePlayers = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["game", gameId, "players"],
    queryFn: () => fetchGamePlayers(gameId),
    enabled,
  });
};
