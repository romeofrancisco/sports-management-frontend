import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchGames,
  createGame,
  deleteGame,
  updateGame,
  fetchGamePlayers,
  fetchGameDetails,
  manageGame,
  fetchCurrentPlayers,
} from "@/api/gamesApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatDate";

export const useGames = (enabled = true) => {
  return useQuery({
    queryKey: ["games"],
    queryFn: fetchGames,
    enabled,
  });
};

export const useGameDetails = (gameId) => {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: () => fetchGameDetails(gameId),
  });
};

export const useCreateGame = () => {
  return useMutation({
    mutationFn: (gameData) => createGame(gameData),
    onSuccess: (game) => {
      toast.success("Game scheduled.", {
        description: formatDate(game.date),
        richColors: true,
      });
      queryClient.invalidateQueries(["games"]);
    },
  });
};

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

export const useDeleteGame = () => {
  return useMutation({
    mutationFn: ({ id }) => deleteGame(id),
    onSuccess: (_, game) => {
      toast.info("Game schedule deleted!", {
        description: `${game.home_team} vs ${game.away_team}'s game has been deleted.`,
        richColors: true,
      });
      queryClient.invalidateQueries(["game"]);
    },
  });
};

export const useGamePlayers = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["game", gameId, "players"],
    queryFn: () => fetchGamePlayers(gameId),
    enabled,
  });
};

export const useCurrentGamePlayers = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["game", gameId, "current_players"],
    queryFn: () => fetchCurrentPlayers(gameId),
    enabled,
  });
};

export const useManageGame = (gameId) => {
  return useMutation({
    mutationFn: (action) => manageGame(gameId, action),
  });
};
