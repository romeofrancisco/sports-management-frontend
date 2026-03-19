import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import FullPageLoading from "@/components/common/FullPageLoading";
import ScoreBoard from "./components/scoring/ScoreBoard";
import TeamSide from "./components/scoring/TeamSide";
import StatButtons from "./components/scoring/StatButtons/StatButtons";
import { useRecordableStats } from "@/hooks/useSports";
import { useCurrentGamePlayers } from "@/hooks/useGames";
import GameSettings from "./components/GameSettings";
import { GAME_STATUS_VALUES } from "@/constants/game";
import { Home, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

const toReadableStatPhrase = (statDetails) => {
  const statName = statDetails?.name?.trim() || "stat";
  const statCode = statDetails?.code?.trim() || "";

  if (/_MA$/i.test(statCode) && !/\bmade\b/i.test(statName)) {
    return `${statName} made`;
  }

  if (/_MS$/i.test(statCode) && !/\bmiss(ed)?\b/i.test(statName)) {
    return `${statName} missed`;
  }

  return statName;
};

const formatLatestStatText = (latestStatRecord) => {
  if (!latestStatRecord) return "No stats recorded yet.";

  const playerName = latestStatRecord.player_name || "Unknown player";
  const statDetails = latestStatRecord?.stat_details;

  return `${playerName} recorded: ${toReadableStatPhrase(statDetails)}.`;
};

const RequireStatsGame = ({ game, isConnected }) => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [isLayoutMode, setIsLayoutMode] = useState(false);
  const [originalPositions, setOriginalPositions] = useState(null);

  // Data fetching
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
  
  // Unified loading/error states
  const isLoading = isStatTypesLoading || isCurrentPlayersLoading;
  const isError = isStatTypesError || isCurrentPlayersError;

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



  // Loading/Error UI
  if (isLoading) return <FullPageLoading />;


  const { home_players, away_players } = currentPlayers;
  const latestStatRecord = Array.isArray(game?.player_stats)
    ? game.player_stats.reduce((latest, current) => {
        if (!latest) return current;

        const latestTime = new Date(latest.timestamp).getTime();
        const currentTime = new Date(current.timestamp).getTime();

        if (Number.isNaN(latestTime) && Number.isNaN(currentTime)) {
          return (current?.id || 0) > (latest?.id || 0) ? current : latest;
        }

        if (Number.isNaN(latestTime)) return current;
        if (Number.isNaN(currentTime)) return latest;

        return currentTime > latestTime ? current : latest;
      }, null)
    : null;

  const latestStatText = formatLatestStatText(latestStatRecord);

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
        <div className="bg-muted py-1 px-4 rounded-md">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {latestStatText}
          </p>
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

export default RequireStatsGame;
