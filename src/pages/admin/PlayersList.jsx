import React from "react";
import PlayersListHeader from "./components/player/PlayersListHeader";
import { PlayersTable } from "./components/player/PlayersTable";

const PlayersList = () => {

  return (
    <div>
      <PlayersListHeader />
      <PlayersTable />
    </div>
  );
};

export default PlayersList;
