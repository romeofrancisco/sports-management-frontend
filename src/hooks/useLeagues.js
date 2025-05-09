import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLeagues,
  fetchLeagueDetails,
  createLeague,
  updateLeague,
  deleteLeague,
  fetchLeagueRankings,
  fetchLeagueStatistics,
  fetchLeagueTeamForm,
  fetchLeagueComprehensiveStats,
  addTeamToLeague,
  removeTeamFromLeague
} from "@/api/leaguesApi";
import { toast } from "sonner";

export const useLeagues = () => {
  return useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeagues,
  });
};

export const useLeagueDetails = (id) => {
  return useQuery({
    queryKey: ["league-details", id],
    queryFn: () => fetchLeagueDetails(id),
    enabled: !!id,
  });
};

export const useLeagueRankings = (id) => {
  return useQuery({
    queryKey: ["league-rankings", id],
    queryFn: () => fetchLeagueRankings(id),
    enabled: !!id,
  });
};

export const useLeagueStatistics = (id) => {
  return useQuery({
    queryKey: ["league-statistics", id],
    queryFn: () => fetchLeagueStatistics(id),
    enabled: !!id,
  });
};

export const useLeagueComprehensiveStats = (id) => {
  return useQuery({
    queryKey: ["league-comprehensive-stats", id],
    queryFn: () => fetchLeagueComprehensiveStats(id),
    enabled: !!id,
  });
};

export const useLeagueTeamForm = (id) => {
  return useQuery({
    queryKey: ["league-team-form", id],
    queryFn: () => fetchLeagueTeamForm(id),
    enabled: !!id,
  });
};

export const useCreateLeague = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newLeague) => createLeague(newLeague),
    onSuccess: () => {
      queryClient.invalidateQueries(["leagues"]);
      toast.success("League created successfully");
    },
  });
};

export const useUpdateLeague = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newLeague }) => updateLeague(id, newLeague),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["leagues"]);
      queryClient.invalidateQueries(["league-details", variables.id]);
      toast.success("League updated successfully");
    },
  });
};

export const useDeleteLeague = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteLeague(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["leagues"]);
      toast.success("League deleted successfully");
    },
  });
};

export const useAddTeamToLeague = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ league_id, team_id }) => addTeamToLeague(league_id, team_id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["league-details", variables.league_id]);
      toast.success("Team added to league");
    },
  });
};

export const useRemoveTeamFromLeague = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ league_id, team_id }) =>
      removeTeamFromLeague(league_id, team_id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["league-details", variables.league_id]);
      toast.success("Team removed from league");
    },
  });
};
