import { useMutation } from "@tanstack/react-query";
import { updatePlayer } from "@/api/playersApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useUpdatePlayer = (slug) => {
  return useMutation({
    mutationFn: (playerData) => updatePlayer(playerData, slug),
    onSuccess: () => {
      toast.success("Player updated", {
        richColors: true,
      });
      // Refetch player
      queryClient.invalidateQueries(["players"]);
    },
  });
};
