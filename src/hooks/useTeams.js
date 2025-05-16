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
} from "@/api/teamsApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useTeams = (filter, enabled = true) => {
  const apiFilter = {
    ...filter,
    sport: filter.sport === "all" ? "" : filter.sport,
    division: filter.division === "all" ? "" : filter.division,
  };

  return useQuery({
    queryKey: ["teams", apiFilter],
    queryFn: () => fetchTeams(apiFilter),
    enabled,
    keepPreviousData: true,
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
    mutationFn: ({team, data}) => updateTeam(data, team),
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
    queryKey: ['teamCoaches', teamSlug],
    queryFn: () => fetchTeamCoaches(teamSlug),
    enabled: !!teamSlug && (options?.enabled !== false),
    ...options,
  });
};

export const useTeamPlayers = (teamSlug, options = {}) => {
  return useQuery({
    queryKey: ['teamPlayers', teamSlug],
    queryFn: () => fetchTeamPlayers(teamSlug),
    enabled: !!teamSlug && (options?.enabled !== false),
    ...options,
  });
};
