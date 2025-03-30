import { useQuery } from "@tanstack/react-query";
import { fetchSportDetails } from "@/api/sportsApi";

export const useSportDetails = (sport, enabled = true) => {
  return useQuery({
    queryKey: ["sport", sport],
    queryFn: () => fetchSportDetails(sport),
    enabled
  });
};
