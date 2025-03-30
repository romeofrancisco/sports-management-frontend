import { useMutation } from "@tanstack/react-query";
import { createStartingLineup } from "@/api/gamesApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useCreateStartingLineup = (gameId) => {
  return useMutation({
    mutationFn: (lineup) => createStartingLineup(lineup, gameId),
    onSuccess: () => {
      toast.success("Added starting lineup", {
        description: "You can now start the game",
        richColors: true,
      });
    },
  });
};
