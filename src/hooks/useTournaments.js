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
  deleteTournamentBracket,
} from "@/api/tournamentApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

const stripListSyntax = (message) => {
  if (typeof message !== "string") return "An error occurred.";
  const trimmed = message.trim();
  const listLikeMatch = trimmed.match(/^\[\s*['\"](.+?)['\"]\s*\]$/);
  if (listLikeMatch?.[1]) {
    return listLikeMatch[1];
  }
  return trimmed;
};

const getBackendErrorMessage = (error) => {
  const data = error?.response?.data;
  if (!data) return "An error occurred.";

  if (typeof data === "string") return stripListSyntax(data);
  if (Array.isArray(data))
    return stripListSyntax(String(data[0] || "An error occurred."));

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

  return "An error occurred.";
};

const getTournamentActionErrorTitle = (action) => {
  const titles = {
    start: "Cannot Start Tournament",
    complete: "Cannot Complete Tournament",
    pause: "Cannot Pause Tournament",
    cancel: "Cannot Cancel Tournament",
  };
  return titles[action] || "Tournament Action Failed";
};

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
      error.status === 400
        ? toast.error("Validation Error", {
            description: "Please check the tournament details and try again.",
            richColors: true,
          })
        : toast.error("Error creating tournament", {
            description:
              error.message ||
              "An error occurred while creating the tournament.",
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
      error.status === 400
        ? toast.error("Validation Error", {
            description: "Please check the tournament details and try again.",
            richColors: true,
          })
        : toast.error("Error updating tournament", {
            description:
              error.message ||
              "An error occurred while updating the tournament.",
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
    mutationFn: ({ tournamentId, teamId }) =>
      addTeamToTournament(tournamentId, teamId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        "tournamentDetails",
        variables.tournamentId,
      ]);
    },
  });
};

export const useRemoveTeamFromTournament = () => {
  return useMutation({
    mutationFn: ({ tournamentId, teamId }) =>
      removeTeamFromTournament(tournamentId, teamId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        "tournamentDetails",
        variables.tournamentId,
      ]);
    },
  });
};

export const useManageTournament = () => {
  return useMutation({
    mutationFn: ({ tournamentId, action }) =>
      manageTournament(tournamentId, action),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        "tournamentDetails",
        variables.tournamentId,
      ]);
      queryClient.invalidateQueries(["tournaments"]);
      toast.success(data.detail || "Tournament action successful", {
        richColors: true,
      });
    },
    onError: (error, variables) => {
      toast.info(getTournamentActionErrorTitle(variables?.action), {
        description: getBackendErrorMessage(error),
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
    enabled: !!tournamentId && options.enabled !== false,
  });
};

export const useDeleteTournamentBracket = () => {
  return useMutation({
    mutationFn: ({ tournamentId }) => deleteTournamentBracket(tournamentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tournamentDetails", variables.tournamentId]);
      queryClient.invalidateQueries(["tournamentBracket", variables.tournamentId]);
      queryClient.invalidateQueries(["tournamentGames", variables.tournamentId]);
      queryClient.invalidateQueries(["tournaments"]);

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
