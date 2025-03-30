import { useMutation } from "@tanstack/react-query";
import { updateGame } from "@/api/gamesApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useUpdateGame = (id) => {
  return useMutation({
    mutationFn: (gameData) => updateGame(gameData, id),
    onSuccess: () => {
      toast.success("Game updated", {
        richColors: true,
      });
      // Refetch game
      queryClient.invalidateQueries(["games"]);
    },
  });
};
