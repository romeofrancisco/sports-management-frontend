import React from "react";
import {
  SearchFilter,
  FilterSex,
  FilterSport,
  FilterYearLevel,
  FilterCourse,
} from "@/components/common/Filters";

const PlayersFilterBar = ({ filter, setFilter }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mx-5  mb-4 md:grid-rows-2 md:grid-cols-[auto_auto_auto_auto] lg:grid-rows-1 lg:grid-cols-[1fr_auto_auto_auto_auto] md:mx-0">
      <SearchFilter
        value={filter.search}
        onChange={(val) => setFilter((prev) => ({ ...prev, search: val }))}
      />
      <FilterSex
        value={filter.sex}
        onChange={(val) => setFilter((prev) => ({ ...prev, sex: val }))}
      />
      <FilterSport
        value={filter.sport}
        onChange={(val) => setFilter((prev) => ({ ...prev, sport: val }))}
      />
      <FilterYearLevel
        value={filter.year_level}
        onChange={(val) => setFilter((prev) => ({ ...prev, year_level: val }))}
      />
      <FilterCourse
        value={filter.course}
        onChange={(val) => setFilter((prev) => ({ ...prev, course: val }))}
      />
    </div>
  );
};

export default PlayersFilterBar;
