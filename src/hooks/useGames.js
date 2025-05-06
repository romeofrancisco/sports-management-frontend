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
import { GAME_ACTIONS } from "@/constants/game";
import { useSelector } from "react-redux";
import { getPeriodLabel } from "@/constants/sport";

export const useGames = (filter, page = 1, pageSize = 10, enabled = true) => {
  const apiFilter = {
    ...filter,
    sport: filter.sport === "all" ? "" : filter.sport,
  };

  return useQuery({
    queryKey: ["games", apiFilter, page, pageSize],
    queryFn: () => fetchGames(apiFilter, page, pageSize),
    enabled,
  });
};

export const useGameDetails = (gameId) => {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: () => fetchGameDetails(gameId),
    enabled: !!gameId,
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
  const { scoring_type } = useSelector((state) => state.sport);
  const period = getPeriodLabel(scoring_type);

  return useMutation({
    mutationFn: (action) => manageGame(gameId, action),
    onSuccess: (_, action) => {
      queryClient.invalidateQueries(["game", gameId]);

      switch (action) {
        case GAME_ACTIONS.COMPLETE:
          toast.success("Game Completed!", { richColors: true });
          break;
        case GAME_ACTIONS.START:
          toast.success("Game Started!", { richColors: true });
          break;
        case GAME_ACTIONS.NEXT_PERIOD:
          toast.success(`Advanced to the next ${period}`, { richColors: true });
          break;
        default:
          break;
      }
    },
    onError: (error, action) => {
      const errorTitle =
        action === GAME_ACTIONS.COMPLETE
          ? "Cannot Complete Game"
          : `Cannot Advance to Next ${period}`;

      toast.info(errorTitle, {
        description: error?.response?.data?.error || "Something went wrong.",
        richColors: true,
      });
    },
  });
};
