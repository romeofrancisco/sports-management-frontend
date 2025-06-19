import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import Loading from "@/components/common/FullLoading";
import PageError from "@/pages/PageError";
import ScoreBoard from "./components/scoring/ScoreBoard";
import TeamSide from "./components/scoring/TeamSide";
import StatButtons from "./components/scoring/StatButtons/StatButtons";
import { useRecordableStats, useSportDetails } from "@/hooks/useSports";
import { useGameDetails, useCurrentGamePlayers } from "@/hooks/useGames";
import { useCoachPermissions } from "@/hooks/useCoachPermissions";
import { setGameDetails } from "@/store/slices/gameSlice";
import { setSport } from "@/store/slices/sportSlice";
import GameSettings from "./components/GameSettings";
import RequireLandscape from "./components/scoring/RequireLandscape";
import { GAME_STATUS_VALUES } from "@/constants/game";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const GameScoring = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkGamePermission } = useCoachPermissions();
  const [isPortrait, setIsPortrait] = useState(false);

  // Data fetching
  const { data: game, isLoading: isGameLoading, isError: isGameError } = useGameDetails(gameId);
  const { data: statTypes, isLoading: isStatTypesLoading, isError: isStatTypesError } = useRecordableStats(gameId);
  const { data: currentPlayers, isLoading: isCurrentPlayersLoading, isError: isCurrentPlayersError } = useCurrentGamePlayers(gameId);
  const { data: sport, isLoading: isSportLoading, isError: isSportError } = useSportDetails(game?.sport_slug)

  // Unified loading/error states
  const isLoading = isGameLoading ||isStatTypesLoading || isCurrentPlayersLoading || isSportLoading
  const isError = isGameError || isStatTypesError || isCurrentPlayersError || isSportError;

  // Check permissions when game data is loaded
  useEffect(() => {
    if (game && !checkGamePermission(game)) {
      navigate('/games', { replace: true });
      return;
    }
  }, [game, checkGamePermission, navigate]);

  // Store game in Redux on load
  useEffect(() => {
    if (game && game.status === GAME_STATUS_VALUES.COMPLETED) {
      return navigate(`/games/${gameId}/game-result`, { replace: true })
    }
    if (game) {
      dispatch(setGameDetails(game));
    }
  }, [game, dispatch]);

  useEffect(() => {
    if (sport) {
      dispatch(setSport(sport))
    }
  }, [sport, dispatch])

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
    const header = document.querySelector('header');
    if (header) {
      // Store original display style to restore later
      const originalDisplay = header.style.display;
      // Hide the header
      header.style.display = 'none';
      
      // Restore on unmount
      return () => {
        header.style.display = originalDisplay;
      };
    }
  }, []);

  // Loading/Error UI
  if (isLoading) return <Loading />;
  if (isError) return <PageError />;
  if (isPortrait) return <RequireLandscape />;

  const { home_players, away_players } = currentPlayers;

  return (
    <div className="relative h-full content-center">
      <div className="flex justify-between items-center px-2 py-1 bg-background/80 backdrop-blur-sm z-20 absolute top-0 left-0 w-full">        <div className="flex gap-2">
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
            onClick={() => navigate('/')}
            title="Home"
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
        <GameSettings />
      </div>
      <div className="pt-12"> {/* Add padding-top to account for the fixed navigation bar */}
        <ScoreBoard />
        <div className="grid gap-2 md:gap-5 grid-cols-[1fr_auto_1fr]">
          <TeamSide players={home_players} />
          <StatButtons statTypes={statTypes} />
          <TeamSide players={away_players} />
        </div>
      </div>
    </div>
  );
};

export default GameScoring;