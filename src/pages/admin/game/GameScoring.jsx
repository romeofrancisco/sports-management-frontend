import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import FullPageLoading from "@/components/common/FullPageLoading";
import PageError from "@/pages/PageError";
import ScoreBoard from "./components/scoring/ScoreBoard";
import TeamSide from "./components/scoring/TeamSide";
import StatButtons from "./components/scoring/StatButtons/StatButtons";
import { useRecordableStats, useSportDetails } from "@/hooks/useSports";
import { useGameDetails, useCurrentGamePlayers } from "@/hooks/useGames";
import { useCoachPermissions } from "@/hooks/useCoachPermissions";
import { useGameScoreWebSocket } from "@/hooks/useGameScoreWebSocket";
import { setGameDetails } from "@/store/slices/gameSlice";
import { setSport } from "@/store/slices/sportSlice";
import GameSettings from "./components/GameSettings";
import RequireLandscape from "./components/scoring/RequireLandscape";
import { GAME_STATUS_VALUES } from "@/constants/game";
import { Home, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

const GameScoring = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkGamePermission } = useCoachPermissions();
  const [isPortrait, setIsPortrait] = useState(false);
  const [isLayoutMode, setIsLayoutMode] = useState(false);
  const [originalPositions, setOriginalPositions] = useState(null);

  // Data fetching
  const {
    data: game,
    isLoading: isGameLoading,
    isError: isGameError,
  } = useGameDetails(gameId);
  const {
    data: statTypes,
    isLoading: isStatTypesLoading,
    isError: isStatTypesError,
  } = useRecordableStats(gameId);
  const {
    data: currentPlayers,
    isLoading: isCurrentPlayersLoading,
    isError: isCurrentPlayersError,
  } = useCurrentGamePlayers(gameId);
  const {
    data: sport,
    isLoading: isSportLoading,
    isError: isSportError,
  } = useSportDetails(game?.sport_slug);
  // Unified loading/error states
  const isLoading =
    isGameLoading ||
    isStatTypesLoading ||
    isCurrentPlayersLoading ||
    isSportLoading;
  const isError =
    isGameError || isStatTypesError || isCurrentPlayersError || isSportError;

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

  // Layout mode handlers
  const handleToggleLayoutMode = () => {
    if (!isLayoutMode) {
      // Entering layout mode - save current positions
      const storageKey = `statButtons_${
        game?.sport_slug || "default"
      }_positions`;
      try {
        const saved = localStorage.getItem(storageKey);
        setOriginalPositions(saved ? JSON.parse(saved) : null);
      } catch (error) {
        console.warn("Failed to load original positions:", error);
        setOriginalPositions(null);
      }
    } else {
      // Exiting layout mode without saving - revert to original positions
      handleLayoutRevert();
    }
    setIsLayoutMode(!isLayoutMode);
  };

  const handleLayoutSave = () => {
    // Save is handled automatically by StatButtons component
    setOriginalPositions(null); // Clear original positions since we're saving
    setIsLayoutMode(false);
  };

  const handleLayoutRevert = () => {
    if (originalPositions) {
      // Restore original positions
      const storageKey = `statButtons_${
        game?.sport_slug || "default"
      }_positions`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(originalPositions));
        // Force a re-render by toggling a state or using a callback
        window.dispatchEvent(new Event("layout-reverted"));
      } catch (error) {
        console.warn("Failed to revert positions:", error);
      }
    }
    setOriginalPositions(null);
  };

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

  // Loading/Error UI
  if (isLoading) return <FullPageLoading />;
  if (isError) return <PageError />;
  if (isPortrait) return <RequireLandscape />;

  const { home_players, away_players } = currentPlayers;
  return (
    <div className="relative h-full content-center">
      {/* Dark overlay when in layout mode */}
      {isLayoutMode && <div className="fixed inset-0 bg-black/60 z-30" />}

      <div
        className={`flex justify-between items-center px-2 bg-background/80 backdrop-blur-sm w-full ${
          isLayoutMode ? "z-40 relative" : "z-20"
        }`}
      >
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            title="Go Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            title="Home"
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {/* WebSocket connection status */}
          {game?.status === GAME_STATUS_VALUES.IN_PROGRESS && (
            <div className="flex items-center gap-1 text-xs">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              ></div>
              <span className="text-muted-foreground">
                {isConnected ? "LIVE" : "OFFLINE"}
              </span>
            </div>
          )}
          <GameSettings
            isLayoutMode={isLayoutMode}
            onToggleLayoutMode={handleToggleLayoutMode}
          />
        </div>
      </div>
      <div>
        {/* Removed pt-12 since header is no longer absolute */}
        <div className="grid grid-cols-[1fr_auto_1fr]">
          <TeamSide players={home_players} />
          <div className="flex flex-col items-center">
            <ScoreBoard />
            <StatButtons
              statTypes={statTypes}
              gameId={gameId}
              sportSlug={game?.sport_slug}
              isLayoutMode={isLayoutMode}
              onLayoutSave={handleLayoutSave}
            />
          </div>
          <TeamSide players={away_players} />
        </div>
      </div>

      {/* Layout Mode Floating Elements */}
      {isLayoutMode && (
        <>
          {/* Layout Mode Indicator */}
          <div className="fixed top-12 left-5 z-50">
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
              Layout Mode
            </div>
          </div>

          {/* Floating Save Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-background border rounded-lg shadow-lg p-3 min-w-[250px] animate-in slide-in-from-right-5 fade-in duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">
                  Save layout changes?
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleToggleLayoutMode}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button onClick={handleLayoutSave} className="flex-1" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GameScoring;
