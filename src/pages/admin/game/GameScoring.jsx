import React, { useEffect, useState } from "react";
import RequireStatsGame from "./RequireStatsGame";
import { useSportDetails } from "@/hooks/useSports";
import FullPageLoading from "@/components/common/FullPageLoading";
import { useGameDetails } from "@/hooks/useGames";
import { useParams } from "react-router";
import NoStatsRequiredGame from "./NoStatsRequiredGame";
import { setGameDetails } from "@/store/slices/gameSlice";
import { setSport } from "@/store/slices/sportSlice";
import { useDispatch } from "react-redux";
import { useCoachPermissions } from "@/hooks/useCoachPermissions";
import { useNavigate } from "react-router";
import { useGameScoreWebSocket } from "@/hooks/useGameScoreWebSocket";
import RequireLandscape from "./components/scoring/RequireLandscape";
import { GAME_STATUS_VALUES } from "@/constants/game";

const GameScoring = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPortrait, setIsPortrait] = useState(false);
  const { checkGamePermission } = useCoachPermissions();

  const { data: game, isLoading: isGameLoading } = useGameDetails(gameId);
  const { data: sport, isLoading: isSportLoading } = useSportDetails(
    game?.sport_slug
  );

  // Check permissions when game data is loaded
  useEffect(() => {
    if (game && !checkGamePermission(game)) {
      navigate("/games", { replace: true });
      return;
    }
  }, [game, checkGamePermission, navigate]);

  // Store game in Redux on load
  useEffect(() => {
    if (game && game.status === GAME_STATUS_VALUES.COMPLETED) {
      return navigate(`/games/${gameId}/game-result`, { replace: true });
    }
    if (game) {
      dispatch(setGameDetails(game));
    }
  }, [game, dispatch]);

  useEffect(() => {
    if (sport) {
      dispatch(setSport(sport));
    }
  }, [sport, dispatch]);

  // Orientation detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");
    const handleOrientationChange = (e) => setIsPortrait(e.matches);

    mediaQuery.addEventListener("change", handleOrientationChange);
    setIsPortrait(mediaQuery.matches); // Initial check

    return () =>
      mediaQuery.removeEventListener("change", handleOrientationChange);
  }, []);

  // Hide sidebar trigger when this component mounts
  useEffect(() => {
    // Get the header with the sidebar trigger
    const header = document.querySelector("header");
    if (header) {
      // Store original display style to restore later
      const originalDisplay = header.style.display;
      // Hide the header
      header.style.display = "none";

      // Restore on unmount
      return () => {
        header.style.display = originalDisplay;
      };
    }
  }, []);

  // WebSocket connection for real-time score updates
  const { isConnected } = useGameScoreWebSocket(
    gameId,
    (scoreData) => {
      // Handle real-time score updates
      console.log("Real-time score update:", scoreData);
    },
    (statusData) => {
      // Handle real-time status updates
      console.log("Real-time status update:", statusData);

      // Redirect if game is completed
      if (statusData.status === GAME_STATUS_VALUES.COMPLETED) {
        navigate(`/games/${gameId}/game-result`, { replace: true });
      }
    }
  );

  if (isPortrait) return <RequireLandscape />;
  if (isGameLoading || isSportLoading) return <FullPageLoading />;

  return sport?.requires_stats ? (
    <RequireStatsGame sport={sport} game={game} isConnected={isConnected} />
  ) : (
    <NoStatsRequiredGame sport={sport} game={game} isConnected={isConnected} />
  );
};

export default GameScoring;
