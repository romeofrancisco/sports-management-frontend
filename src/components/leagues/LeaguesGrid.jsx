import React from "react";
import LeagueCard from "./LeagueCard";

const LeaguesGrid = ({ leagues, viewMode }) => {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map((league) => (
          <div key={league.id}>
            <LeagueCard league={league} viewMode="grid" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leagues.map((league) => (
        <div key={league.id}>
          <LeagueCard league={league} viewMode="list" />
        </div>
      ))}
    </div>
  );
};

export default LeaguesGrid;
