import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createSeason,
  fetchSeasons,
  updateSeason,
  deleteSeason,
  deleteSeasonBracket,
  fetchSeasonDetails,
  fetchSeasonStandings,
  manageSeason,
  fetchSeasonTeamPerformance,
  fetchSeasonComparison,
  fetchSeasonGames,
  fetchSeasonTeamForm,
} from "@/api/seasonsApi";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";
import { useRef } from "react";

const stripListSyntax = (message) => {
  if (typeof message !== "string") return "Failed to manage season";
  const trimmed = message.trim();
  const listLikeMatch = trimmed.match(/^\[\s*['\"](.+?)['\"]\s*\]$/);
  if (listLikeMatch?.[1]) {
    return listLikeMatch[1];
  }
  return trimmed;
};

const getBackendErrorMessage = (error) => {
  const data = error?.response?.data;
  if (!data) return "Failed to manage season";

  if (typeof data === "string") return stripListSyntax(data);
  if (Array.isArray(data)) return stripListSyntax(String(data[0] || "Failed to manage season"));

  const preferredFields = ["detail", "error", "non_field_errors", "action"];
  for (const field of preferredFields) {
    const value = data[field];
    if (typeof value === "string") return stripListSyntax(value);
    if (Array.isArray(value) && value.length > 0) {
      return stripListSyntax(String(value[0]));
    }
  }

  for (const value of Object.values(data)) {
    if (typeof value === "string") return stripListSyntax(value);
    if (Array.isArray(value) && value.length > 0) {
      return stripListSyntax(String(value[0]));
    }
  }

  return "Failed to manage season";
};

const getSeasonActionErrorTitle = (action) => {
  const titles = {
    start: "Cannot Start Season",
    complete: "Cannot Complete Season",
    pause: "Cannot Pause Season",
    cancel: "Cannot Cancel Season",
  };
  return titles[action] || "Season Action Failed";
};

export const useSeasons = (league, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["seasons", league, page, pageSize],
    queryFn: () => fetchSeasons(league, page, pageSize),
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
    mutationFn: ({ id, data }) => updateSeason(league, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["seasons"]);
      toast.success("Season updated successfully");
    },
  });
};

export const useDeleteSeason = () => {
  const toastIdRef = useRef(null);

  return useMutation({
    mutationFn: ({ leagueId, seasonId }) => deleteSeason(leagueId, seasonId),
    onMutate: () => {
      const id = toast.loading("Deleting season...", {
        richColors: true,
      });
      toastIdRef.current = id;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["seasons"]);
      if (toastIdRef.current) {
        toast.success("Season deleted successfully", {
          richColors: true,
          id: toastIdRef.current,
        });
      }
    },
    onError: () => {
      if (toastIdRef.current) {
        toast.error("Failed to delete season", { id: toastIdRef.current });
      }
    },
  });
};

export const useManageSeason = () => {
  return useMutation({
    mutationFn: ({ league, season_id, action }) =>
      manageSeason(league, season_id, action),
    onSuccess: (data, variables) => {
      const actions = {
        start: "started",
        complete: "completed",
        pause: "paused",
        cancel: "canceled",
      };
      const actionText = actions[variables.action] || "updated";

      queryClient.invalidateQueries(["seasons", variables.league]);
      queryClient.invalidateQueries([
        "season-details",
        variables.league,
        variables.season_id,
      ]);

      toast.success(`Season ${actionText} successfully`);
    },
    onError: (error, variables) => {
      toast.info(getSeasonActionErrorTitle(variables?.action), {
        richColors: true,
        description: getBackendErrorMessage(error),
      });
    },
  });
};

export const useDeleteSeasonBracket = () => {
  return useMutation({
    mutationFn: ({ leagueId, seasonId }) =>
      deleteSeasonBracket(leagueId, seasonId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["seasons", variables.leagueId]);
      queryClient.invalidateQueries([
        "season-details",
        variables.leagueId,
        variables.seasonId,
      ]);
      queryClient.invalidateQueries([
        "bracket",
        variables.leagueId,
        variables.seasonId,
      ]);
      queryClient.invalidateQueries([
        "season-games",
        variables.leagueId,
        variables.seasonId,
      ]);

      toast.success(data?.detail || "Bracket deleted successfully", {
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Cannot Delete Bracket", {
        description: getBackendErrorMessage(error),
        richColors: true,
      });
    },
  });
};

export const useSeasonGames = (league, season, filters = {}) => {
  return useQuery({
    queryKey: ["season-games", league, season, filters],
    queryFn: () => fetchSeasonGames(league, season, filters),
    enabled: !!league && !!season,
  });
};

export const useSeasonTeamForm = (league_id, season_id, limit = 5) => {
  return useQuery({
    queryKey: ["season-team-form", league_id, season_id, limit],
    queryFn: () => fetchSeasonTeamForm(league_id, season_id, limit),
    enabled: !!league_id && !!season_id,
  });
};
