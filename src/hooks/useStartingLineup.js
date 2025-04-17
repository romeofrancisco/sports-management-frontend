import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchStartingLineup, updateStartingLineup } from "@/api/gamesApi";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

export const useStartingLineup = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["starting-lineup", gameId],
    queryFn: () => fetchStartingLineup(gameId),
    enabled,
  });
};

export const useUpdateStartingLineup = (gameId) => {
  return useMutation({
    mutationFn: (lineup) => updateStartingLineup(lineup, gameId),
    onSuccess: () => {
      queryClient.invalidateQueries(["starting-lineup", gameId]);
      toast.success("Lineup Registered",{
        richColors: true
      })
    },
  });
};

