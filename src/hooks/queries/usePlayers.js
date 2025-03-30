import { useQuery } from "@tanstack/react-query";
import { fetchPlayers } from "@/api/playersApi";

export const usePlayers = (enabled = true) => {
  return useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    enabled,
  });
};
