import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  createSeason, 
  fetchSeasons, 
  updateSeason, 
  deleteSeason, 
  fetchSeasonDetails,
  fetchSeasonStandings,
  manageSeason,
  fetchSeasonTeamPerformance,
  fetchSeasonComparison,
  fetchSeasonGames
} from "@/api/seasonsApi";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

export const useSeasons = (league) => {
  return useQuery({
    queryKey: ["seasons", league],
    queryFn: () => fetchSeasons(league),
    enabled: !!league,
  });
};

export const useSeasonDetails = (league, season) => {
  return useQuery({
    queryKey: ["season-details", league, season],
    queryFn: () => fetchSeasonDetails(league, season),
    enabled: !!league && !!season,
  });
};

export const useSeasonStandings = (league, season) => {
  return useQuery({
    queryKey: ["season-standings", league, season],
    queryFn: () => fetchSeasonStandings(league, season),
    enabled: !!league && !!season,
  });
};

export const useSeasonTeamPerformance = (league, season) => {
  return useQuery({
    queryKey: ["season-team-performance", league, season],
    queryFn: () => fetchSeasonTeamPerformance(league, season),
    enabled: !!league && !!season,
  });
};

export const useSeasonComparison = (league, seasonIds = []) => {
  return useQuery({
    queryKey: ["season-comparison", league, ...seasonIds],
    queryFn: () => fetchSeasonComparison(league, seasonIds),
    enabled: !!league,
  });
};

export const useCreateSeason = (league) => {

  return useMutation({
    mutationFn: (data) => createSeason(league, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["seasons", variables.league]);
      toast.success("Season created successfully");
    },
  });
};

export const useUpdateSeason = (league) => {

  return useMutation({
    mutationFn: ({id, data}) => updateSeason(league, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["seasons"]);
      toast.success("Season updated successfully");
    },
  });
};

export const useDeleteSeason = () => {
  return useMutation({
    mutationFn: ({ leagueId, seasonId }) => deleteSeason(leagueId, seasonId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["seasons", variables.league]);
      toast.success("Season deleted successfully");
    },
  });
};

export const useManageSeason = () => {

  return useMutation({
    mutationFn: ({ league, season_id, action }) => manageSeason(league, season_id, action),
    onSuccess: (data, variables) => {
      const actions = {
        start: "started",
        complete: "completed",
        pause: "paused",
        cancel: "canceled"
      };
      const actionText = actions[variables.action] || "updated";
      
      queryClient.invalidateQueries(["seasons", variables.league]);
      queryClient.invalidateQueries(["season-details", variables.league, variables.season_id]);
      
      toast.success(`Season ${actionText} successfully`);
    },
    onError: (error) => {
      // Get error message from the response if available
      const message = error.response?.data?.detail || "Failed to manage season";
      toast.error(message);
    }
  });
};

export const useSeasonGames = (league, season, filters = {}) => {
  return useQuery({
    queryKey: ["season-games", league, season, filters],
    queryFn: () => fetchSeasonGames(league, season, filters),
    enabled: !!league && !!season,
  });
};
