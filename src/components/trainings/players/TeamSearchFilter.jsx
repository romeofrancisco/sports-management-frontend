import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SportFilter } from "@/components/trainings/dashboard/TrainingDashboardFilter";

/**
 * A component that provides search and filtering functionality for teams
 *
 * @param {Object} props
 * @param {Array} props.sports - List of sports
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Handler for filter changes
 * @returns {JSX.Element}
 */
const TeamSearchFilter = ({ sports, filters, onFilterChange }) => {
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };
  return (
    <div className="space-y-4">
      {/* Search Input - Full width on mobile */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search teams..."
          className="pl-8 w-full"
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      {/* Sport Filter - Consistent with PlayerSearchFilter layout */}
      <div className="flex-1 sm:flex-initial">
        <SportFilter
          sports={sports}
          selectedSport={filters.sport}
          setSelectedSport={(value) => handleFilterChange("sport", value)}
        />
      </div>
    </div>
  );
};

export default TeamSearchFilter;
