import React, { useEffect } from "react";
import GameResultHeader from "./components/GameResultHeader";
import { useGameDetails } from "@/hooks/useGames";
import { useParams } from "react-router";
import GameFlowChart from "@/components/charts/GameFlowChart/index";
import TeamStatsComparison from "@/components/charts/TeamComparisonChart";
import Boxscore from "./components/Boxscore";
import GameLeaders from "./components/GameLeaders";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import FullPageLoading from "@/components/common/FullPageLoading";

const GameResult = () => {
  const { gameId } = useParams();
  const { data: game, isLoading: isGameLoading } = useGameDetails(gameId);

  if (isGameLoading) return <FullPageLoading />;

  return (
    <div className="bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Game Result Analysis"
          subtitle="Sports Management"
          description="Detailed game statistics, performance metrics, and team comparison"
          showUniversityColors={true}
          showBackButton={true}
          backButtonText="Back to Games"
          onBack={() => navigate(-1)}
        />

        <div className="animate-in fade-in-50 duration-500 delay-100">
          <div className="grid gap-5 mb-5">
            <GameResultHeader game={game} />
            {game.sport_requires_stats && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
