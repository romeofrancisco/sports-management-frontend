import { useQuery } from "@tanstack/react-query";
import { createSeason, deleteSeason, fetchSeasons, updateSeason } from "@/api/seasonsApi";

export const useSeasons = (leagueId, enabled = true) => {
  return useQuery({
    queryKey: ["seasons", leagueId],
    queryFn: () => fetchSeasons(leagueId),
    enabled,
  });
};

export const useCreateSeason = (leagueId) => {
  return useMutation({
    mutationFn: (seasonData) => createSeason(leagueId, seasonData),
    onSuccess: () => {
      toast.success("Season Created", {
        richColors: true,
      });
      queryClient.invalidateQueries(["seasons"]);
    },
  });
};

export const useUpdateSeason = (leagueId) => {
  return useMutation({
    mutationFn: (seasonData) => updateSeason(leagueId, seasonData),
    onSuccess: () => {
      toast.success("Season Updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["seasons"]);
    },
  });
};

export const useDeleteSeason = (leagueId) => {
  return useMutation({
    mutationFn: () => deleteSeason(leagueId),
    onSuccess: () => {
      toast.success("Season Updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["seasons"]);
    },
  });
};
