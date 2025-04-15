import React from "react";
import TeamsListHeader from "./components/team/TeamsListHeader";
import TeamTable from "./components/team/TeamsContainer";

const TeamsList = () => {

  return (
    <div>
      <TeamsListHeader />
      <TeamTable />
    </div>
  );
};

export default TeamsList;
