import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPlayer } from "@/store/slices/playerStatSlice";
import { reset } from "@/store/slices/playerStatSlice";
import JerseyNumber from "./JerseyNumber";

const TeamSide = ({ players }) => {
  const dispatch = useDispatch();
  const { playerId } = useSelector((state) => state.playerStat);


  const handlePlayerClick = (player) => {
    // Reset if click the player again
    if (player.id == playerId) return dispatch(reset());

    return dispatch(setPlayer({ id: player.id, team: player.team }));
  };

  return (
    <div className="grid border-2 border-primary/20 p-2 grid-rows-5 gap-3 select-none">
      {players.map((player) => (
        <button
          onClick={() => handlePlayerClick(player)}
          key={player.id}
          className={`aspect-auto border-2 cursor-pointer min-h-12 rounded-lg grid grid-cols-[auto_1fr] items-center justify-center px-2 lg:px-5 ${
            playerId === player.id
              ? "bg-primary text-white opacity-100"
              : "bg-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground/80 transition-all duration-300"
          }`}
        >
          <JerseyNumber
            number={player.jersey_number}
            className={`size-10 text-xs lg:size-16`}
            selected={playerId === player.id}
          />
          <p className="flex gap-2 text-xs lg:text-lg">{player.short_name}</p>
        </button>
      ))}
    </div>
  );
};

export default TeamSide;
