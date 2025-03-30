import { useQuery } from "@tanstack/react-query";
import { fetchPlayerDetails } from "@/api/playersApi";

export const usePlayerDetails = (player) => {
  return useQuery({
    queryKey: ["player", player],
    queryFn: () => fetchPlayerDetails(player),
  });
};
