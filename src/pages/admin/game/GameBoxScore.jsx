import React from "react";
import GameBoxScoreHeader from "./components/GameBoxScoreHeader";
import { useGameDetails } from "@/hooks/useGames";
import { useParams } from "react-router";
import Loading from "@/components/common/FullLoading";
import GameFlowChart from "@/components/charts/GameFlowChart";

const GameBoxScore = () => {
  const { gameId } = useParams();
  const { data: game, isLoading: isGameLoading } = useGameDetails(gameId);

  if (isGameLoading) return <Loading />;

  return (
    <div className="grid gap-4">
      <GameBoxScoreHeader game={game} />
      <div className="grid lg:grid-cols-[40%_60%]">
        <div className="w-full"></div>
        <GameFlowChart />
      </div>
    </div>
  );
};

export default GameBoxScore;
