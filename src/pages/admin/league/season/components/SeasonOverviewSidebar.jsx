import React from "react";
import SeasonLeaders from "./SeasonLeaders";

const SeasonOverviewSidebar = ({ leagueId, seasonId }) => {
  return (
    <div className="xl:col-span-1 space-y-6">      
      {/* Season Leaders Section */}
      <div className="animate-in fade-in-50 duration-500 delay-400">
        <SeasonLeaders leagueId={leagueId} seasonId={seasonId} />
      </div>
    </div>
  );
};

export default SeasonOverviewSidebar;
