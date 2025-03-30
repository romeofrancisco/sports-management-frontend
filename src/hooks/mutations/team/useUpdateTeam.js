import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";
import { updateTeam } from "@/api/teamsApi";

export const useUpdateTeam = (team) => {
  return useMutation({
    mutationFn: (teamData) => updateTeam(teamData, team),
    onSuccess: () => {
      toast.success("Team updated", {
        richColors: true,
      });
      // Refetch player
      queryClient.invalidateQueries(["teams"]);
    },
  });
};
