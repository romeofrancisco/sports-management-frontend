import React from "react";
import GameResultHeader from "./components/GameResultHeader";
import { useGameDetails } from "@/hooks/useGames";
import { useParams } from "react-router";
import Loading from "@/components/common/FullLoading";
import GameFlowChart from "@/components/charts/GameFlowChart/index";
import TeamStatsComparison from "@/components/charts/TeamComparisonChart";
import Boxscore from "./components/Boxscore";
import GameLeaders from "./components/GameLeaders";

const GameResult = () => {
  const { gameId } = useParams();
  const { data: game, isLoading: isGameLoading } = useGameDetails(gameId);

  if (isGameLoading) return <Loading />;

  return (
    <div className="grid gap-5 mb-5">
      <GameResultHeader game={game} />
      <div className="grid lg:grid-cols-[20rem_1fr] gap-5">
        <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-5">
          <GameLeaders game={game} />
          <GameFlowChart game={game} />
          <TeamStatsComparison game={game} />
        </div>
        <div className="order-first lg:order-last">
          <Boxscore game={game} />
        </div>
      </div>
    </div>
  );
};

export default GameResult;
