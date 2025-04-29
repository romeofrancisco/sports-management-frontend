import React from "react";
import GameBoxScoreHeader from "./components/GameBoxScoreHeader";
import { useGameDetails } from "@/hooks/useGames";
import { useParams } from "react-router";
import Loading from "@/components/common/FullLoading";

const GameBoxScore = () => {
  const { gameId } = useParams();
  const { data: game, isLoading } = useGameDetails(gameId);

  if (isLoading) return <Loading />;

  return (
    <div>
      <GameBoxScoreHeader game={game} />
    </div>
  );
};

export default GameBoxScore;
