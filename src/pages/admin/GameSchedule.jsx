import React, { useState } from "react";
import GameScheduleHeader from "./components/game/GameScheduleHeader";
import { useGames } from "@/hooks/useGames";
import Loading from "@/components/common/Loading";
import { GameTable } from "./components/game/GameTable";
import FilterGameStatus from "./components/game/FilterGameStatus";
import PageError from "../PageError";

const GameSchedule = () => {
  const { data: games, isLoading, isError } = useGames();
  const [filter, setFilter] = useState("scheduled");

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  const filteredGame = games.filter((game) => game.status === filter);


  return (
    <div className="flex h-full flex-col">
      <GameScheduleHeader />
      <div className="mt-4 flex flex-col">
        <FilterGameStatus filterStatus={setFilter} />
        <GameTable games={filteredGame} />
      </div>
    </div>
  );
};

export default GameSchedule;
