import {
  fetchTournaments,
  updateTournament,
  deleteTournament,
  createTournament,
  fetchTournamentDetails,
  fetchTournamentStandings,
  fetchTournamentStatistics,
  fetchTournamentComprehensiveStats,
  fetchTournamentTeamForm,
  fetchTournamentLeaders,
  addTeamToTournament,
  removeTeamFromTournament,
  manageTournament,
  fetchTournamentTeamStatistics,
  fetchTournamentGames,
  fetchTournamentBracket,
} from "@/api/tournamentApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useTournaments = () => {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournaments,
  });
};

export const useCreateTournament = () => {
  return useMutation({
    mutationFn: (tournamentData) => createTournament(tournamentData),
    onSuccess: () => {
      queryClient.invalidateQueries(["tournaments"]);
      toast.success("Tournament created successfully", {
        description: "The tournament has been created.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Error creating tournament", {
        description:
          error.message || "An error occurred while creating the tournament.",
        richColors: true,
      });
    },
  });
};

export const useTournamentDetails = (tournamentId) => {
  return useQuery({
    queryKey: ["tournamentDetails", tournamentId],
    queryFn: () => fetchTournamentDetails(tournamentId),
  });
};

export const useUpdateTournament = () => {
  return useMutation({
    mutationFn: ({ tournamentId, tournamentData }) =>
      updateTournament(tournamentId, tournamentData),
    onSuccess: () => {
      queryClient.invalidateQueries(["tournaments"]);
      toast.success("Tournament updated successfully", {
        description: "The tournament has been updated.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Error updating tournament", {
        description:
          error.message || "An error occurred while updating the tournament.",
        richColors: true,
      });
    },
  });
};

export const useDeleteTournament = () => {
  return useMutation({
    mutationFn: (tournamentId) => deleteTournament(tournamentId),
    onSuccess: () => {
      queryClient.invalidateQueries(["tournaments"]);
      toast.success("Tournament deleted successfully", {
        description: "The tournament has been deleted.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Error deleting tournament", {
        description:
          error.message || "An error occurred while deleting the tournament.",
        richColors: true,
      });
    },
  });
};

export const useTournamentStandings = (tournamentId) => {
  return useQuery({
    queryKey: ["tournamentStandings", tournamentId],
    queryFn: () => fetchTournamentStandings(tournamentId),
    enabled: !!tournamentId,
  });
};

export const useTournamentStatistics = (tournamentId) => {
  return useQuery({
    queryKey: ["tournamentStatistics", tournamentId],
    queryFn: () => fetchTournamentStatistics(tournamentId),
    enabled: !!tournamentId,
  });
};

export const useTournamentComprehensiveStats = (tournamentId) => {
  return useQuery({
    queryKey: ["tournamentComprehensiveStats", tournamentId],
    queryFn: () => fetchTournamentComprehensiveStats(tournamentId),
    enabled: !!tournamentId,
  });
};

export const useTournamentTeamForm = (tournamentId) => {
  return useQuery({
    queryKey: ["tournamentTeamForm", tournamentId],
    queryFn: () => fetchTournamentTeamForm(tournamentId),
    enabled: !!tournamentId,
  });
};

export const useTournamentLeaders = (tournamentId) => {
  return useQuery({
    queryKey: ["tournamentLeaders", tournamentId],
    queryFn: () => fetchTournamentLeaders(tournamentId),
    enabled: !!tournamentId,
  });
};

export const useTournamentTeamStatistics = (tournamentId, teamId) => {
  return useQuery({
    queryKey: ["tournamentTeamStatistics", tournamentId, teamId],
    queryFn: () => fetchTournamentTeamStatistics(tournamentId, teamId),
    enabled: !!tournamentId && !!teamId,
  });
};

export const useAddTeamToTournament = () => {
  return useMutation({
    mutationFn: ({ tournamentId, teamId }) => addTeamToTournament(tournamentId, teamId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tournamentDetails", variables.tournamentId]);
    },
  });
};

export const useRemoveTeamFromTournament = () => {
  return useMutation({
    mutationFn: ({ tournamentId, teamId }) => removeTeamFromTournament(tournamentId, teamId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tournamentDetails", variables.tournamentId]);
    },
  });
};

export const useManageTournament = () => {
  return useMutation({
    mutationFn: ({ tournamentId, action }) => manageTournament(tournamentId, action),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tournamentDetails", variables.tournamentId]);
      queryClient.invalidateQueries(["tournaments"]);
      toast.success(data.detail || "Tournament action successful");
    },
    onError: (error) => {
      toast.error("Error performing action", {
        description: error.response?.data?.detail || error.message || "An error occurred.",
        richColors: true,
      });
    },
  });
};

export const useTournamentGames = (tournamentId, filters = {}) => {
  return useQuery({
    queryKey: ["tournamentGames", tournamentId, filters],
    queryFn: () => fetchTournamentGames(tournamentId, filters),
    enabled: !!tournamentId,
  });
};

export const useTournamentBracket = (tournamentId, options = {}) => {
  return useQuery({
    queryKey: ["tournamentBracket", tournamentId],
    queryFn: () => fetchTournamentBracket(tournamentId),
    enabled: !!tournamentId && (options.enabled !== false),
  });
};
