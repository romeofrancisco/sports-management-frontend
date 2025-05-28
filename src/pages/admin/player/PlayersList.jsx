import React, { useState } from "react";
import PlayersListHeader from "./components/PlayersListHeader";
import PlayersContainer from "./components/PlayersContainer";

const PlayersList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
        <PlayersListHeader />
        <PlayersContainer />
    </div>
  );
};

export default PlayersList;
