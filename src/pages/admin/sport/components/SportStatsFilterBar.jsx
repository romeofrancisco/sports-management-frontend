import React from "react";
import {
  FilterStatType,
  SearchFilter,
} from "@/components/common/Filters";

const SportStatsFilterBar = ({ filter, setFilter }) => {
  return (
    <div className="flex justify-between gap-4">
      <SearchFilter
        value={filter.search}
        onChange={(search) => setFilter((prev) => ({ ...prev, search }))}
        className="max-w-[20rem]"
      />
    </div>
  );
};

export default SportStatsFilterBar;
