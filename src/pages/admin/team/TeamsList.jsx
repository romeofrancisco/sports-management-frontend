import React from "react";
import TeamsListHeader from "./components/TeamsListHeader";
import TeamsContainer from "./components/TeamsContainer";

const TeamsList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
        <TeamsListHeader />
        <TeamsContainer />
    </div>
  );
};

export default TeamsList;
