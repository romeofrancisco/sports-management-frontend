import React from "react";
import TournamentCard from "./TournamentCard";

const TournamentsGrid = ({ tournaments, viewMode }) => {
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id}>
            <TournamentCard tournament={tournament} viewMode="grid" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tournaments.map((tournament) => (
        <div key={tournament.id}>
          <TournamentCard tournament={tournament} viewMode="list" />
        </div>
      ))}
    </div>
  );
};

export default TournamentsGrid;
