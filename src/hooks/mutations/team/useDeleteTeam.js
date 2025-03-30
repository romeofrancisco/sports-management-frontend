import { useMutation } from "@tanstack/react-query";
import { deleteTeam } from "@/api/teamsApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

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
