import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/context/QueryProvider";
import { createSubstitution } from "@/api/gamesApi";
import { toast } from "sonner";

export const useSubstitution = (gameId) => {
  return useMutation({
    mutationFn: (data) => createSubstitution(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["game", gameId, "current_players"]);
      toast.success("Players Substituted", {
        richColors: true
      })
    },
  });
};
