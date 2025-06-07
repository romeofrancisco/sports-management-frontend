import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchTeams,
  fetchTeamDetails,
  fetchSportTeams,
  createTeam,
  deleteTeam,
  updateTeam,
  fetchTeamsInSeason,
  fetchTeamCoaches,
  fetchTeamPlayers,
  fetchTeamAnalytics,
  fetchTeamPerformance,
  fetchTeamGames,
  fetchAllTeamGames,
  fetchTeamTrainingSessions,
  fetchTeamStatistics,
} from "@/api/teamsApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useTeams = (filter, page = 1, pageSize = 10, enabled = true) => {
  const params = {
    ...filter,
    page,
    page_size: pageSize,
  };

  return useQuery({
    queryKey: ["teams", params],
    queryFn: () => fetchTeams(params),
    enabled,
    keepPreviousData: true,
  });
};

// Hook to fetch all teams for dropdowns and forms
export const useAllTeams = (enabled = true) => {
  return useQuery({
    queryKey: ["teams", "all"],
    queryFn: () => fetchTeams({ page_size: 1000 }), // Large page size to get all teams
    enabled,
    select: (data) => data?.results || data || [], // Extract the teams array
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
  });
};

export const useTeamDetails = (team) => {
  return useQuery({
    queryKey: ["team", team],
    queryFn: () => fetchTeamDetails(team),
  });
};

export const useSportTeams = (sport) => {
  return useQuery({
    queryKey: [sport, "teams"],
    queryFn: () => fetchSportTeams(sport),
    enabled: !!sport,
  });
};

export const useCreateTeam = () => {
  return useMutation({
    mutationFn: (teamData) => createTeam(teamData),
    onSuccess: (teamData) => {
      toast.success("Team created successfully!", {
        description: `${teamData.name} team is now registered.`,
        richColors: true,
      });
      // Refetch teams
      queryClient.invalidateQueries(["teams"]);
    },
  });
};

export const useDeleteTeam = () => {
  return useMutation({
    mutationFn: ({ team }) => deleteTeam(team),
    onSuccess: (_, team) => {
      toast.info("Team deleted!", {
        description: `${team.name} team has been deleted.`,
        richColors: true,
      });
      // Refetch teams
      queryClient.invalidateQueries(["teams"]);
    },
  });
};

export const useUpdateTeam = () => {
  return useMutation({
    mutationFn: ({ team, data }) => updateTeam(data, team),
    onSuccess: () => {
      toast.success("Team updated", {
        richColors: true,
      });
      // Refetch teams
      queryClient.invalidateQueries(["teams"]);
    },
  });
};

export const useTeamsInSeason = (leagueId, seasonId) => {
  return useQuery({
    queryKey: ["season-teams", leagueId, seasonId],
    queryFn: () => fetchTeamsInSeason(leagueId, seasonId),
    enabled: !!leagueId && !!seasonId,
  });
};

export const useTeamCoaches = (teamSlug, options = {}) => {
  return useQuery({
    queryKey: ["teamCoaches", teamSlug],
    queryFn: () => fetchTeamCoaches(teamSlug),
    enabled: !!teamSlug && options?.enabled !== false,
    ...options,
  });
};

export const useTeamPlayers = (teamSlug, options = {}) => {
  return useQuery({
    queryKey: ["teamPlayers", teamSlug],
    queryFn: () => fetchTeamPlayers(teamSlug),
    enabled: !!teamSlug && options?.enabled !== false,
    ...options,
  });
};

export const useTeamAnalytics = (teamSlug, days = 30) => {
  return useQuery({
    queryKey: ["team-analytics", teamSlug, days],
    queryFn: () => fetchTeamAnalytics(teamSlug, days),
    enabled: !!teamSlug, // 5 minutes
  });
};

export const useTeamPerformance = (teamSlug, season = null) => {
  return useQuery({
    queryKey: ["team-performance", teamSlug, season],
    queryFn: () => fetchTeamPerformance(teamSlug, season),
    enabled: !!teamSlug, // 10 minutes
  });
};

export const useTeamGames = (teamSlug, params = {}) => {
  return useQuery({
    queryKey: ["team-games", teamSlug, params],
    queryFn: () => fetchTeamGames(teamSlug, params),
    enabled: !!teamSlug,
  });
};

export const useAllTeamGames = (teamSlug) => {
  return useQuery({
    queryKey: ["all-team-games", teamSlug],
    queryFn: () => fetchAllTeamGames(teamSlug),
    enabled: !!teamSlug,
  });
};

export const useTeamTrainingSessions = (teamSlug, params = {}) => {
  return useQuery({
    queryKey: ["team-training-sessions", teamSlug, params],
    queryFn: () => fetchTeamTrainingSessions(teamSlug, params),
    enabled: !!teamSlug,
  });
};

export const useTeamStatistics = (teamSlug, period = "season") => {
  return useQuery({
    queryKey: ["team-statistics", teamSlug, period],
    queryFn: () => fetchTeamStatistics(teamSlug, period),
    enabled: !!teamSlug,
  });
};
