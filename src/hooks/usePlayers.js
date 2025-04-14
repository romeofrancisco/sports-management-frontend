import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchPlayers,
  createPlayer,
  deletePlayer,
  updatePlayer,
  fetchPlayerDetails,
} from "@/api/playersApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const usePlayers = (filter, enabled = true) => {
  const apiFilter = {
    ...filter,
    sport: filter.sport === "all" ? "" : filter.sport,
    year_level: filter.year_level === "all" ? "" : filter.year_level,
    course: filter.course === "all" ? "" : filter.course,
  };

  return useQuery({
    queryKey: ["players", apiFilter],
    queryFn: () => fetchPlayers(apiFilter),
    enabled,
    keepPreviousData: true,
  });
};

export const usePlayerDetails = (player) => {
  return useQuery({
    queryKey: ["player", player],
    queryFn: () => fetchPlayerDetails(player),
  });
};

export const useCreatePlayer = () => {
  return useMutation({
    mutationFn: (playerData) => createPlayer(playerData),
    onSuccess: () => {
      toast.success("Player registered", {
        richColors: true,
      });
      queryClient.invalidateQueries(["player"]);
    },
  });
};

export const useUpdatePlayer = (playerId) => {
  return useMutation({
    mutationFn: (playerData) => updatePlayer(playerData, playerId),
    onSuccess: () => {
      toast.success("Player updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["players"]);
    },
  });
};

export const useDeletePlayer = () => {
  return useMutation({
    mutationFn: ({ player }) => deletePlayer(player),
    onSuccess: (_, player) => {
      toast.info("Player account deleted!", {
        description: `${player.first_name} ${player.last_name}'s account deleted.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["player"]);
    },
  });
};
