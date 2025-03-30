import { useQuery } from "@tanstack/react-query";
import { fetchSportPositions } from "@/api/sportsApi";

export const useSportPositions = (sport, enabled = true) => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: () => fetchSportPositions(sport),
    enabled,
  });
};
