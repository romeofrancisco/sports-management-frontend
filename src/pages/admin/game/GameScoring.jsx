import React, { useEffect, useState } from "react";
import { replace, useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import Loading from "@/components/common/FullLoading";
import PageError from "@/pages/PageError";
import ScoreBoard from "./components/scoring/ScoreBoard";
import TeamSide from "./components/scoring/TeamSide";
import StatButtons from "./components/scoring/StatButtons/StatButtons";
import { useRecordableStats, useSportDetails } from "@/hooks/useSports";
import { useGameDetails, useCurrentGamePlayers } from "@/hooks/useGames";
import { setGameDetails } from "@/store/slices/gameSlice";
import { setSport } from "@/store/slices/sportSlice";
import GameSettings from "./components/GameSettings";
import RequireLandscape from "./components/scoring/RequireLandscape";
import { GAME_STATUS_VALUES } from "@/constants/game";
import { useModal } from "@/hooks/useModal";

const GameScoring = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPortrait, setIsPortrait] = useState(false);

  // Data fetching
  const { data: game, isLoading: isGameLoading, isError: isGameError } = useGameDetails(gameId);
  const { data: statTypes, isLoading: isStatTypesLoading, isError: isStatTypesError } = useRecordableStats(gameId);
  const { data: currentPlayers, isLoading: isCurrentPlayersLoading, isError: isCurrentPlayersError } = useCurrentGamePlayers(gameId);
  const { data: sport, isLoading: isSportLoading, isError: isSportError } = useSportDetails(game?.sport_slug)
  const {isOpen, openModal, closeModal} = useModal();

  // Unified loading/error states
  const isLoading = isGameLoading ||isStatTypesLoading || isCurrentPlayersLoading || isSportLoading
  const isError = isGameError || isStatTypesError || isCurrentPlayersError || isSportError;

  // Store game in Redux on load
  useEffect(() => {
    if (game && game.status === GAME_STATUS_VALUES.COMPLETED) {
      return navigate(`/games/${gameId}/boxscore`, { replace: true })
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

  // Loading/Error UI
  if (isLoading) return <Loading />;
  if (isError) return <PageError />;
  if (isPortrait) return <RequireLandscape />;

  const { home_players, away_players } = currentPlayers;



  return (
    <div className="relative h-full content-center">
      <ScoreBoard />
      <GameSettings />
      <div className="grid gap-2 md:gap-5 grid-cols-[1fr_auto_1fr]">
        <TeamSide players={home_players} />
        <StatButtons statTypes={statTypes} />
        <TeamSide players={away_players} />
      </div>
    </div>
  );
};

export default GameScoring;