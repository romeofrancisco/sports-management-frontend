import React from "react";
import {
  FilterStatType,
  SearchFilter,
} from "@/components/common/Filters";

const SportStatsFilterBar = ({ filter, setFilter }) => {
  return (
    <div className="flex justify-between">
      <SearchFilter
        value={filter.search}
        onChange={(search) => setFilter((prev) => ({ ...prev, search }))}
        className="max-w-[20rem]"
      />
      <FilterStatType
        value={filter.is_record}
        onChange={(is_record) => setFilter((prev) => ({ ...prev, is_record }))}
        className="min-w-[8rem]"
      />
    </div>
  );
};

export default SportStatsFilterBar;
