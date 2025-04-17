import React from "react";

const LeagueTeams = ({ teams }) => {
  return (
    <div className="grid grid-cols-2 gap-5 mt-5 md:grid-cols-4 lg:grid-cols-6 lg:gap-8 lg:mt-10">
      {teams.map((team) => (
        <div className="aspect-square border bg-muted/20 flex flex-col items-center justify-center gap-3">
          <img src={team.logo} alt={team.name} className="size-[40%]" />
          <span className="text-sm font-medium lg:text-lg">{team.name}</span>
        </div>
      ))}
    </div>
  );
};

export default LeagueTeams;
