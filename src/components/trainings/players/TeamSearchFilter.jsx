import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SportFilter } from "@/components/trainings/dashboard/TrainingDashboardFilter";
import { Label } from "@radix-ui/react-dropdown-menu";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative grid gap-1">
        <Label className="text-xs text-muted-foreground text-left">Search</Label>
        <Search className="absolute left-2.5 top-7 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search teams..."
          className="pl-8"
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      <div className="place-self-end grid gap-1">
        <Label className="text-xs text-muted-foreground text-left">Sport</Label>
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
