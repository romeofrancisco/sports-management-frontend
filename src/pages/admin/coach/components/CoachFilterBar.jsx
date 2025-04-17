import { SearchFilter, FilterSex } from "@/components/common/Filters";
import React from "react";

const CoachFilterBar = ({ filter, setFilter }) => {
  return (
    <div className="grid gap-5 grid-cols-[1fr_auto] mb-4">
      <SearchFilter
        className="max-w-[20rem]"
        onChange={(search) => setFilter((prev) => ({ ...prev, search }))}
      />
      <FilterSex
        value={filter.sex}
        className="min-w-[7rem]"
        onChange={(sex) => setFilter((prev) => ({ ...prev, sex }))}
      />
    </div>
  );
};

export default CoachFilterBar;
