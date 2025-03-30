import { useMutation } from "@tanstack/react-query";
import { createGame } from "@/api/gamesApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatDate";

export const useCreateGame = () => {
  return useMutation({
    mutationFn: (gameData) => createGame(gameData),
    onSuccess: (game) => {
      toast.success("Game scheduled.", {
        description: formatDate(game.date),
        richColors: true,
      });
      // Refetch teams
      queryClient.invalidateQueries(["games"]);
    },
  });
};
