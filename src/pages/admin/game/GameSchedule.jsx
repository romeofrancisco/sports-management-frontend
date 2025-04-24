import React from "react";
import GameScheduleHeader from "./components/GameScheduleHeader";
import GameTable from "./components/GameTable";

const GameSchedule = () => {

  return (
    <div className="flex h-full flex-col">
      <GameScheduleHeader />
      <GameTable />
    </div>
  );
};

export default GameSchedule;
