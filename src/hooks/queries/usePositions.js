import { useQuery } from "@tanstack/react-query";
import { fetchPositions } from "@/api/sportsApi";

export const usePositions = (enabled = true) => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
    enabled,
  });
};
