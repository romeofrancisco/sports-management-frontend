import React from "react";
import { SearchFilter, FilterSport, FilterDivision } from "@/components/common/Filters";

const TeamFiltersBar = ({ filter, setFilter }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_auto] gap-2 mx-5 md:mx-0 mb-4">
      <SearchFilter
        value={filter.search}
        onChange={(val) => setFilter((prev) => ({ ...prev, search: val }))}
      />
      <FilterSport
        value={filter.sport}
        onChange={(val) => setFilter((prev) => ({ ...prev, sport: val }))}
      />
      <FilterDivision
        value={filter.division}
        onChange={(val) => setFilter((prev) => ({ ...prev, division: val }))}
      />
    </div>
  );
};

export default TeamFiltersBar;
