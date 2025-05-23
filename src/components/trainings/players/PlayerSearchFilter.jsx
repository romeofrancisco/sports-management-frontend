import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  SportFilter,
  TeamFilter,
} from "@/components/trainings/dashboard/TrainingDashboardFilter";

/**
 * A component that provides search and filtering functionality for players
 *
 * @param {Object} props
 * @param {Array} props.sports - List of sports
 * @param {Array} props.teams - List of teams
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Handler for filter changes
 * @returns {JSX.Element}
 */
const PlayerSearchFilter = ({ sports, teams, filters, onFilterChange }) => {
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search players..."
          className="pl-8"
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      <div className="flex gap-2 place-self-end">
        {/* Sport Filter */}
        <SportFilter
          sports={sports}
          selectedSport={filters.sport}
          setSelectedSport={(value) => handleFilterChange("sport", value)}
        />
        {/* Team Filter */}
        <TeamFilter
          teams={teams}
          selectedTeam={filters.team}
          setSelectedTeam={(value) => handleFilterChange("team", value)}
        />
      </div>
    </div>
  );
};

export default PlayerSearchFilter;
