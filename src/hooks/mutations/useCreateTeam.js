import { useMutation } from "@tanstack/react-query";
import { createTeam } from "@/api/teamsApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamData) => createTeam(teamData),
    onSuccess: () => {
      toast.success("Team created successfully!", {
        description: `'{teamName}' is now registered. You can assign players.`,
        richColors: true,
      });
      // Refetch teams
      queryClient.invalidateQueries(["teams"]);
    },
  });
};
