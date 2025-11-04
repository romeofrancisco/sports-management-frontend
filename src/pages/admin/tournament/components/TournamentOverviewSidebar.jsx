import React from "react";
import TournamentLeaders from "./TournamentLeaders";
import TournamentTopTeams from "./TournamentTopTeams";

const TournamentOverviewSidebar = ({ tournamentId, standings }) => {
  return (
    <div className="xl:col-span-1 space-y-6">      
      {/* Tournament Leaders Section */}
      <div className="animate-in fade-in-50 duration-500 delay-400">
        <TournamentLeaders tournamentId={tournamentId} />
      </div>

      {/* Top Teams Section
      <div className="animate-in fade-in-50 duration-500 delay-500">
        <TournamentTopTeams standings={standings} />
      </div> */}
    </div>
  );
};

export default TournamentOverviewSidebar;
