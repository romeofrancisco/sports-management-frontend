import DataTable from "@/components/common/DataTable";
import { useSportPositions } from "@/hooks/useSports";
import React, { useState } from "react";
import { useParams } from "react-router";
import getSportPositionsColumn from "./SportPositionColumns";
import { Button } from "@/components/ui/button";
import { SearchFilter } from "@/components/common/Filters";

const SportPositionsTable = () => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [filter, setFilter] = useState({ search: "" });
  const { sport } = useParams();
  const { data: positions, isLoading } = useSportPositions(sport);

  const columns = getSportPositionsColumn({ selectedStat });

  return (
    <div className='className="px-5 md:border md:bg-muted/30 md:p-5 lg:p-8 my-5 rounded-lg'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl semibold">Player Positions</h1>
        <Button>Create New Position</Button>
      </div>
      <SearchFilter
        value={filter.search}
        onChange={(search) => setFilter((prev) => ({ ...prev, search }))}
      />
      <DataTable columns={columns} data={positions || []} loading={isLoading} />
    </div>
  );
};

export default SportPositionsTable;
