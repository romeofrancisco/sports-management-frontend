import React from "react";
import SportDetailsHeader from "./components/SportDetailsHeader";
import SportStatsTable from "./components/SportStatsTable";
import SportPositionsTable from "./components/SportPositionsTable.";

const Sport = () => {
  return (
    <div>
      <SportDetailsHeader />
      <div className="lg:grid grid-cols-2 gap-5">
        <SportStatsTable />
        <SportPositionsTable />
      </div>
    </div>
  );
};

export default Sport;
