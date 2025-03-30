import { useMutation } from "@tanstack/react-query";
import { deleteGame } from "@/api/gamesApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useDeleteGame = () => {
  return useMutation({
    mutationFn: ({ id }) => deleteGame(id),
    onSuccess: (_, game) => {
      toast.info("Game schedule deleted!", {
        description: `${game.home_team} vs ${game.away_team}'s game has been deleted.`,
        richColors: true,
      });
      // Refetch player
      queryClient.invalidateQueries(["game"]);
    },
  });
};
