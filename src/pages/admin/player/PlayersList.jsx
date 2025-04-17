import React from "react";
import PlayersListHeader from "./components/PlayersListHeader";
import { PlayersTable } from "./components/PlayersTable";

const PlayersList = () => {

  return (
    <div>
      <PlayersListHeader />
      <PlayersTable />
    </div>
  );
};

export default PlayersList;
