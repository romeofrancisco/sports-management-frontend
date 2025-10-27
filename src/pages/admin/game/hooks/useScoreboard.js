import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateGameScores } from "@/store/slices/gameSlice";
import { useUpdateGameScore } from "@/hooks/useGames";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export const useScoreboard = (game) => {
  const dispatch = useDispatch();
  const { mutate: updateScore, isPending: isUpdatingScore } = useUpdateGameScore();
  
  // Get current scores from Redux store
  const {
    home_team_score,
    away_team_score,
    home_team,
    away_team,
  } = useSelector((state) => state.game);

  const handleScoreUpdate = (team, points) => {
    if (isUpdatingScore) return;
    
    updateScore(
      {
        gameId: game.id,
        scoreData: {
          team: team.id,
          points: points,
          period: game.current_period || 1,
        },
      },
    );
  };

  return {
    isUpdatingScore,
    home_team_score,
    away_team_score,
    home_team,
    away_team,
    handleScoreUpdate,
  };
};