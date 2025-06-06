import React from "react";
import LeagueCard from "./LeagueCard";

const LeaguesGrid = ({ leagues, viewMode }) => {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {leagues.map((league, index) => (
          <div
            key={league.id}
            className="animate-in fade-in-50 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <LeagueCard league={league} index={index} viewMode="grid" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leagues.map((league, index) => (
        <div
          key={league.id}
          className="animate-in fade-in-50 duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <LeagueCard league={league} index={index} viewMode="list" />
        </div>
      ))}
    </div>
  );
};

export default LeaguesGrid;
