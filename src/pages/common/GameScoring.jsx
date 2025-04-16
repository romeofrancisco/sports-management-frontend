import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import Loading from "@/components/common/FullLoading";
import PageError from "../PageError";
import ScoreBoard from "./components/ScoreBoard";
import TeamSide from "./components/TeamSide";
import StatButtons from "./components/StatButtons/StatButtons";
import { useRecordableStats, useSportDetails } from "@/hooks/useSports";
import { useGamePlayers, useGameDetails, useCurrentGamePlayers } from "@/hooks/useGames";
import { setGameDetails } from "@/store/slices/gameSlice";
import { setSport } from "@/store/slices/sportSlice";
import GameSettings from "./components/GameSettings";
import RequireLandscape from "./components/RequireLandscape";

const GameScoring = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isPortrait, setIsPortrait] = useState(false);

  // Data fetching
  const { data: game, isLoading: isGameLoading, isError: isGameError } = useGameDetails(id);
  const { data: statTypes, isLoading: isStatTypesLoading, isError: isStatTypesError } = useRecordableStats(id);
  const { data: players, isLoading: isPlayersLoading, isError: isPlayersError } = useGamePlayers(id);
  const { data: currentPlayers, isLoading: isCurrentPlayersLoading, isError: isCurrentPlayersError } = useCurrentGamePlayers(id);
  const { data: sport, isLoading: isSportLoading, isError: isSportError } = useSportDetails(game?.sport_slug)

  // Unified loading/error states
  const isLoading = isGameLoading ||isStatTypesLoading ||isPlayersLoading || isCurrentPlayersLoading || isSportLoading
  const isError = isGameError || isStatTypesError || isPlayersError || isCurrentPlayersError || isSportError;

  // Store game in Redux on load
  useEffect(() => {
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
