import React from "react";

const TeamSide = ({ players, startingLineup, className = "" }) => {
  const playing = players.filter((player) =>
    startingLineup.some((lineupItem) => lineupItem.player === player.id)
  );

  return (
    <div className={`grid grid-rows-5 gap-3 lg:gap-5 ${className}`}>
      {playing.map((player) => (
        <div
          key={player.id}
          className="aspect-auto rounded-sm bg-muted grid grid-cols-[auto_1fr] items-center justify-center gap-3 lg:px-5"
        >
          <img
            src={player.profile}
            alt={player.full_name}
            className="size-8 lg:size-14"
          />
          <p className="flex gap-2 text-xs">
            <span className="font-medium">#{player.jersey_number}</span>
            {player.full_name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TeamSide;
