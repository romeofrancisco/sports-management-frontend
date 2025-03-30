import { useQuery } from "@tanstack/react-query";
import { fetchCoaches } from "@/api/teamsApi";

export const useCoaches = (enabled = true) => {
  return useQuery({
    queryKey: ["coaches"],
    queryFn: fetchCoaches,
    enabled,
  });
};
