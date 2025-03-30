import { useMutation } from "@tanstack/react-query";
import { createTeam } from "@/api/teamsApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

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
