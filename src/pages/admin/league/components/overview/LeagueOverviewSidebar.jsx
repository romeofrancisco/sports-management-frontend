import React from "react";
import LeagueLeaders from "../standings/LeagueLeaders";

const LeagueOverviewSidebar = ({ league, rankings }) => {
  return (
    <div className="xl:col-span-1 space-y-6">      
      {/* League Leaders Section */}
      <div className="animate-in fade-in-50 duration-500 delay-400">
        <LeagueLeaders leagueId={league} />
      </div>
    </div>
  );
};

export default LeagueOverviewSidebar;
