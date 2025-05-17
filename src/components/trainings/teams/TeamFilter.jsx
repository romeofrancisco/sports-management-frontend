import React, { memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";

const TeamFilter = ({ 
  teams = [], 
  selectedTeamId,
  onSelect,
  placeholder = "Select a team" 
}) => {
  return (
    <div className="w-48">
      <Select value={selectedTeamId} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all_teams">All Teams</SelectItem>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.slug}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(TeamFilter);
