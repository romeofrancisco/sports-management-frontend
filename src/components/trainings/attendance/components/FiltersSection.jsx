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
import { TeamSelect } from '@/components/common/TeamSelect';

const FiltersSection = ({ 
  selectedTeam, 
  onTeamChange, 
  dateRange, 
  onDateRangeChange, 
  teams = [],
  teamsLoading = false 
}) => {
  return (
    <div className="flex gap-2">
      {/* Team Filter */}
      <div className="flex-1">
        <Label htmlFor="team-select" className="text-xs text-muted-foreground font-medium">
          Team Selection
        </Label>
        <TeamSelect
          id="team-select"
          name="team"
          teams={teams}
          value={selectedTeam}
          onChange={onTeamChange}
          disabled={teamsLoading}
          className="w-full"
          searchPlaceholder="Search teams..."
        />
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
