import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createSeason,
  deleteSeason,
  fetchSeasons,
  updateSeason,
  fetchSeasonDetails,
  fetchSeasonStandings,
} from "@/api/seasonsApi";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

export const useSeasons = (leagueId) => {
  return useQuery({
    queryKey: ["seasons", leagueId],
    queryFn: () => fetchSeasons(leagueId),
    enabled: !!leagueId,
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
    mutationFn: ({id, data}) => updateSeason(leagueId, id, data),
    onSuccess: () => {
      toast.success("Season Updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["seasons"]);
    },
  });
};

export const useDeleteSeason = () => {
  return useMutation({
    mutationFn: ({ leagueId, seasonId }) => deleteSeason(leagueId, seasonId),
    onSuccess: () => {
      toast.info("Season Deleted", {
        richColors: true,
      });
      queryClient.invalidateQueries(["seasons"]);
    },
  });
};
