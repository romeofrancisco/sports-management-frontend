import React from "react";
import GameScheduleHeader from "./components/game/GameScheduleHeader";
import GameTable from "./components/game/GameTable";

const GameSchedule = () => {

  return (
    <div className="flex h-full flex-col">
      <GameScheduleHeader />
      <GameTable />
    </div>
  );
};

export default GameSchedule;
