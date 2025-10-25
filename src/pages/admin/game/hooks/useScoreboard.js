import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateGameScores } from "@/store/slices/gameSlice";
import { useUpdateGameScore } from "@/hooks/useGames";
import { toast } from "sonner";

export const useScoreboard = (game) => {
  const dispatch = useDispatch();
  const { mutate: updateScore, isLoading: isUpdatingScore } = useUpdateGameScore();
  const [isPortrait, setIsPortrait] = useState(false);
  
  // Get current scores from Redux store
  const {
    home_team_score,
    away_team_score,
    home_team,
    away_team,
  } = useSelector((state) => state.game);

  // Orientation detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");
    const handleOrientationChange = (e) => setIsPortrait(e.matches);

    mediaQuery.addEventListener("change", handleOrientationChange);
    setIsPortrait(mediaQuery.matches);

    return () => mediaQuery.removeEventListener("change", handleOrientationChange);
  }, []);

  // Hide header when component mounts
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      const originalDisplay = header.style.display;
      header.style.display = "none";
      return () => {
        header.style.display = originalDisplay;
      };
    }
  }, []);

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
      {
        onSuccess: () => {
          // Update local state
          const newScores = {
            home_team_score: team.id === home_team.id 
              ? Math.max(0, home_team_score + points)
              : home_team_score,
            away_team_score: team.id === away_team.id 
              ? Math.max(0, away_team_score + points)
              : away_team_score,
          };
          dispatch(updateGameScores(newScores));
        },
        onError: (error) => {
          toast.error("Failed to update score", {
            description: error?.response?.data?.error || "Something went wrong",
          });
        },
      }
    );
  };

  return {
    isPortrait,
    isUpdatingScore,
    home_team_score,
    away_team_score,
    home_team,
    away_team,
    handleScoreUpdate,
  };
};