import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DateRangePickerWithPresets } from '@/components/ui/date-range-picker-with-presets';

const FiltersSection = ({ 
  selectedTeam, 
  onTeamChange, 
  dateRange, 
  onDateRangeChange, 
  teams = [],
  teamsLoading = false 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Team Filter */}
      <div className="ml-auto">
        <Label htmlFor="team-select" className="text-xs text-muted-foreground font-medium">
          Team Selection
        </Label>
        <Select value={selectedTeam} onValueChange={onTeamChange} disabled={teamsLoading}>
          <SelectTrigger className="min-w-[150px]" id="team-select">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id.toString()}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {teamsLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 border-2 border-muted border-t-primary rounded-full animate-spin"></div>
            Loading teams...
          </div>
        )}
      </div>

      {/* Date Range Filter */}
      <div>
        <Label htmlFor="date-range" className="text-xs text-muted-foreground font-medium">
          Date Range
        </Label>
        <DateRangePickerWithPresets
          value={dateRange}
          onChange={onDateRangeChange}
          placeholder="Select date range..."
        />
      </div>
    </div>
  );
};

export default FiltersSection;
