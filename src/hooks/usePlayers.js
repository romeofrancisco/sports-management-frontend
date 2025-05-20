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

export const usePlayers = (filter, page = 1, pageSize = 10, enabled = true) => {
  const apiFilter = {
    ...filter,
    sport: filter.sport === "all" ? "" : filter.sport,
    year_level: filter.year_level === "all" ? "" : filter.year_level,
    course: filter.course === "all" ? "" : filter.course,
    page,
    page_size: pageSize,
  };

  return useQuery({
    queryKey: ["players", apiFilter, page, pageSize],
    queryFn: () => fetchPlayers(apiFilter),
    enabled,
    keepPreviousData: true,
  });
};

export const useTeamPlayers = (filter) => {
  return useQuery({
    queryKey: ["team-players", filter],
    queryFn: async () => {
      const data = await fetchPlayers(filter);
      return data.results || [];
    },
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

export const useUpdatePlayer = () => {
  return useMutation({
    mutationFn: ({ player, data }) => updatePlayer(player, data),
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
