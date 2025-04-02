import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchLeagues,
  createLeague,
  updateLeague,
  deleteLeague,
} from "@/api/leaguesApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useLeagues = (enabled = true) => {
  return useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeagues,
    enabled,
  });
};

export const useCreateLeague = () => {
  return useMutation({
    mutationFn: (leagueData) => createLeague(leagueData),
    onSuccess: () => {
      toast.success("League Created", {
        richColors: true,
      });
      queryClient.invalidateQueries(["leagues"]);
    },
  });
};

export const useUpdateLeague = (leagueId) => {
  return useMutation({
    mutationFn: (leagueData) => updateLeague(leagueId, leagueData),
    onSuccess: () => {
      toast.success("League Updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["leagues"]);
    },
  });
};

export const useDeleteLeague = () => {
  return useMutation({
    mutationFn: ({ id }) => deleteLeague(id),
    onSuccess: () => {
      toast.success("League Deleted", {
        richColors: true,
      });
      queryClient.invalidateQueries(["leagues"]);
    },
  });
};
