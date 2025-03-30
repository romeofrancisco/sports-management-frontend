import { useMutation } from "@tanstack/react-query";
import { createPlayer } from "@/api/playersApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useCreatePlayer = () => {
  return useMutation({
    mutationFn: (playerData) => createPlayer(playerData),
    onSuccess: () => {
      toast.success("Player registered", {
        richColors: true,
      });
      // Refetch player
      queryClient.invalidateQueries(["player"]);
    },
  });
};
