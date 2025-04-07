import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchStartingLineup, createStartingLineup } from "@/api/gamesApi";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

export const useStartingLineup = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["starting-lineup", gameId],
    queryFn: () => fetchStartingLineup(gameId),
    enabled,
  });
};

export const useCreateStartingLineup = (gameId) => {
  return useMutation({
    mutationFn: (lineup) => createStartingLineup(lineup, gameId),
    onSuccess: () => {
      queryClient.invalidateQueries(["starting-lineup", gameId]);
    },
  });
};

