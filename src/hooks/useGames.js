import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchGames,
  createGame,
  deleteGame,
  updateGame,
  fetchGameDetails,
  manageGame,
  fetchGamePlayers,
  fetchCurrentPlayers,
  assignCoachToGame,
  removeCoachFromGame,
  fetchAvailableCoaches,
  fetchGameCoachAssignments,
  updateGameScore,
} from "@/api/gamesApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";
import { formatDate, formatShortDate, formatTime } from "@/utils/formatDate";
import { GAME_ACTIONS } from "@/constants/game";
import { useSelector } from "react-redux";
import { getPeriodLabel } from "@/constants/sport";
import { formatTo12HourTime } from "@/utils/formatTime";

export const useGames = (filter, page = 1, pageSize = 10, enabled = true) => {
  const apiFilter = {
    ...filter,
    page,
    page_size: pageSize,
  };

  return useQuery({
    queryKey: ["games", apiFilter],
    queryFn: () => fetchGames(apiFilter),
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
      toast.success("Game scheduled successfully!", {
        description: `${game.home_team?.name || "Home Team"} vs ${
          game.away_team?.name || "Away Team"
        } - ${formatShortDate(game.date)} at ${formatTo12HourTime(game.time)}`,
        richColors: true,
      });
      queryClient.invalidateQueries(["games"]);
    },
  });
};

export const useUpdateGame = (id) => {
  return useMutation({
    mutationFn: (gameData) => updateGame(gameData, id),
    onSuccess: (game) => {
      toast.success("Game updated successfully!", {
        description: `${game.home_team?.name || "Home Team"} vs ${
          game.away_team?.name || "Away Team"
        } - ${formatShortDate(game.date)} at ${formatTo12HourTime(game.time)}`,
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

// Coach assignment hooks
export const useAvailableCoaches = (enabled = true) => {
  return useQuery({
    queryKey: ["available-coaches"],
    queryFn: fetchAvailableCoaches,
    enabled,
  });
};

export const useGameCoachAssignments = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["game-coach-assignments", gameId],
    queryFn: () => fetchGameCoachAssignments(gameId),
    enabled: enabled && !!gameId,
  });
};

export const useAssignCoachToGame = () => {
  return useMutation({
    mutationFn: ({ gameId, coachId }) => assignCoachToGame(gameId, coachId),
    onSuccess: (_, { gameId }) => {
      queryClient.invalidateQueries(["game-coach-assignments", gameId]);
      queryClient.invalidateQueries(["games"]);
      toast.success("Coach assigned successfully!", { richColors: true });
    },
    onError: (error) => {
      toast.error("Failed to assign coach", {
        description: error?.response?.data?.error || "Something went wrong.",
        richColors: true,
      });
    },
  });
};

export const useRemoveCoachFromGame = () => {
  return useMutation({
    mutationFn: ({ gameId, coachId }) => removeCoachFromGame(gameId, coachId),
    onSuccess: (_, { gameId }) => {
      queryClient.invalidateQueries(["game-coach-assignments", gameId]);
      queryClient.invalidateQueries(["games"]);
      toast.success("Coach removed successfully!", { richColors: true });
    },
    onError: (error) => {
      toast.error("Failed to remove coach", {
        description: error?.response?.data?.error || "Something went wrong.",
        richColors: true,
      });
    },
  });
};

export const useUpdateGameScore = () => {
  return useMutation({
    mutationFn: ({ gameId, scoreData }) => updateGameScore(gameId, scoreData),
    onSuccess: (_, { gameId }) => {
      queryClient.invalidateQueries(["game", gameId]);
      toast.success("Game score updated successfully!", { richColors: true });
    },
    onError: (error) => {
      toast.error("Failed to update game score", {
        description: error?.response?.data?.error || "Something went wrong.",
        richColors: true,
      });
    },
  });
};
