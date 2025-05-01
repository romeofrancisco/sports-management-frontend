import React from "react";
import SportDetailsHeader from "./components/SportDetailsHeader";
import SportStatsTable from "./components/SportStatsTable";
import SportPositionsTable from "./components/SportPositionsTable.";
import SportFormulaTable from "./components/SportFormulaTable";

const Sport = () => {
  return (
    <div className="w-full max-w-screen overflow-x-hidden">
      <SportDetailsHeader />
      <div className="grid w-full max-w-screen gap-5 mt-5">
        <SportStatsTable />
        <div className="grid md:grid-cols-2 gap-5 mb-10 ">
          <SportFormulaTable />
          <SportPositionsTable />
        </div>
      </div>
    </div>
  );
};

export default Sport;
