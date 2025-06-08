import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBracket, fetchBracket } from "@/api/seasonsApi";
import { queryClient } from "@/context/QueryProvider";

export const useCreateBracket = (leagueId, seasonId) => {
  return useMutation({
    mutationFn: (data) => createBracket(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["season-details", leagueId, seasonId]);
      toast.success("Bracket Generated", {
        richColors: true,
      });
    },
  });
};

export const useBracket = (leagueId, seasonId, options = {}) => {
  return useQuery({
    queryKey: ["bracket", leagueId, seasonId],
    queryFn: () => fetchBracket(seasonId),
    enabled: !!seasonId && (options.enabled !== false),
    ...options,
  });
};
