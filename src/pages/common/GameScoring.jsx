import React from "react";
import StatButtons from "./components/StatButtons";
import Loading from "@/components/common/Loading";
import { useParams } from "react-router";
import { useRecordableStats } from "@/hooks/useSports";
import { useGamePlayers } from "@/hooks/useGames";
import PageError from "../PageError";
import TeamSide from "./components/TeamSide";
import { useStartingLineup } from "@/hooks/useStartingLineup";
import { useSportDetails } from "@/hooks/useSports";
import { useGameDetails } from "@/hooks/useGames";

const GameScoring = () => {
  const { id } = useParams();
  const { data: game, isLoading: isGameLoading, isError: isGameError } = useGameDetails(id);
  const { data: statTypes, isLoading: isStatTypesLoading, isError: isStatTypesError } = useRecordableStats(id);
  const { data: players, isLoading: isPlayersLoading, isError: isPlayersError } =  useGamePlayers(id)
  const { data: startingLineup, isLoading: isStartingLineupLoading, isError: isStartingLineupError } =  useStartingLineup(id)
  const { data: sport, isLoading: isSportLoading, isError: isSportError } = useSportDetails(game?.sport_slug)

  const isLoading = isPlayersLoading || isStatTypesLoading || isStartingLineupLoading
  const isError = isPlayersError || isStatTypesError || isStartingLineupError

  if (isLoading) return <Loading/>
  if (isError) return <PageError/>

  
  const { home_team, away_team } = players
  const { home_starting_lineup, away_starting_lineup } = startingLineup

  return (
  <div className="grid grid-cols-2 gap-5 lg:grid-cols-[auto_auto_auto]">
    <TeamSide 
      className="order-1 md:order-none"
      players={home_team} 
      startingLineup={home_starting_lineup} 
    />
    <StatButtons 
      className="order-3 col-span-2 lg:col-span-1 lg:order-none" 
      statTypes={statTypes} 
    />
    <TeamSide 
      className="order-2 lg:order-none"
      players={away_team} 
      startingLineup={away_starting_lineup} 
    />
  </div>
  );
};

export default GameScoring;
