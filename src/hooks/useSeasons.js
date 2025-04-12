import { useQuery } from "@tanstack/react-query";
import { createSeason, deleteSeason, fetchSeasons, updateSeason, fetchSeasonDetails, fetchSeasonStandings } from "@/api/seasonsApi";

export const useSeasons = (leagueId, enabled = true) => {
  return useQuery({
    queryKey: ["seasons", leagueId],
    queryFn: () => fetchSeasons(leagueId),
    enabled,
  });
};

export const useSeasonDetails = (leagueId, seasonId) => {
  return useQuery({
    queryKey: ["seasons", seasonId, leagueId],
    queryFn: () => fetchSeasonDetails(leagueId, seasonId),
    enabled: !!leagueId && !!seasonId,
  });
};

export const useSeasonStandings = (leagueId, seasonId) => {
  return useQuery({
    queryKey: ["seasons_standings", seasonId, leagueId],
    queryFn: () => fetchSeasonStandings(leagueId, seasonId),
    enabled: !!leagueId && !!seasonId,
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


