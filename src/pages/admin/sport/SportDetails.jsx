import React from "react";
import SportDetailsHeader from "./components/SportDetailsHeader";
import SportStatsTable from "./components/SportStatsTable";
import SportPositionsTable from "./components/SportPositionsTable.";
import SportFormulaTable from "./components/SportFormulaTable";

const Sport = () => {
  return (
    <>
      <SportDetailsHeader />
      <div className="grid lg:grid-cols-2 gap-5 mb-10 mt-5">
        <SportStatsTable />
        <SportFormulaTable />
        <SportPositionsTable />
      </div>
    </>
  );
};

export default Sport;
