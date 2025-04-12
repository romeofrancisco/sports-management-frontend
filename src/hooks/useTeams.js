import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchTeams,
  fetchTeamDetails,
  fetchSportTeams,
  createTeam,
  deleteTeam,
  updateTeam,
} from "@/api/teamsApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useTeams = (enabled = true) => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => fetchTeams(),
    enabled,
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
    enabled,
  });
}

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

export const useUpdateTeam = (team) => {
  return useMutation({
    mutationFn: (teamData) => updateTeam(teamData, team),
    onSuccess: () => {
      toast.success("Team updated", {
        richColors: true,
      });
      // Refetch teams
      queryClient.invalidateQueries(["teams"]);
    },
  });
};
