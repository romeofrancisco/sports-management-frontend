import { useMutation } from "@tanstack/react-query";
import { deletePlayer } from "@/api/playersApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useDeletePlayer = () => {
  return useMutation({
    mutationFn: ({ player }) => deletePlayer(player),
    onSuccess: (_, player) => {
      toast.info("Player account deleted!", {
        description: `${player.first_name} ${player.last_name}'s account deleted.`,
        richColors: true,
      });
      // Refetch player
      queryClient.invalidateQueries(["player"]);
    },
  });
};
