import React, { memo } from 'react';

const PlayerSelectorChips = ({ 
  players = [],
  selectedPlayerIds = [],
  onTogglePlayer
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {players.map((player) => {
        const isSelected = selectedPlayerIds.includes(player.id);
        return (
          <div
            key={player.id}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => onTogglePlayer(player.id)}
          >
            {player.name}
          </div>
        );
      })}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(PlayerSelectorChips);
