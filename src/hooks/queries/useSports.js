import { useQuery } from "@tanstack/react-query";
import { fetchSports } from "@/api/sportsApi";

export const useSports = (enabled = true) => {
  return useQuery({
    queryKey: ["sports"],
    queryFn: fetchSports,
    enabled
  });
};
