import React, { memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PlayerFilter = ({ 
  players = [], 
  selectedPlayerId = '',
  onSelect,
  placeholder = "Select a player" 
}) => {
  return (
    <div className="w-64">
      <Select
        value={selectedPlayerId}
        onValueChange={onSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no_player">None</SelectItem>
          {players.map((player) => (
            <SelectItem key={player.id} value={player.id}>
              {player.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(PlayerFilter);
