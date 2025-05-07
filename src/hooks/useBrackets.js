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

export const useBracket = (season) => {
  return useQuery({
    queryKey: ["bracket", season],
    queryFn: () => fetchBracket(season),
    enabled: !!season,
  });
};
