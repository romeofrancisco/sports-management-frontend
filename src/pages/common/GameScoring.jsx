import React from "react";
import StatButtons from "./components/StatButtons";
import Loading from "@/components/common/Loading";
import { useParams } from "react-router";
import { useRecordableStats } from "@/hooks/queries/game/useRecordableStats";
import { useGamePlayers } from "@/hooks/queries/game/useGamePlayers";
import PageError from "../PageError";
import { TEAM_SIDES } from "@/constants/game";

const GameScoring = () => {
  const { id } = useParams();
  const { data: statTypes, isLoading: isStatTypesLoading, isError: isStatTypesError } = useRecordableStats(id);
  const { data: players, isLoading: isPlayersLoading, isError: isPlayersError } =  useGamePlayers(id)

  const isLoading = isPlayersLoading || isStatTypesLoading
  const isError = isPlayersError || isStatTypesError

  if (isLoading) return <Loading/>
  if (isError) return <PageError/>

  const homeTeam = players.filter((player) => player.team_side === TEAM_SIDES.HOME_TEAM)
  const awayTeam = players.filter((player) => player.team_side === TEAM_SIDES.AWAY_TEAM)

  return (
    <div>
      <StatButtons statTypes={statTypes} />
    </div>
  );
};

export default GameScoring;
