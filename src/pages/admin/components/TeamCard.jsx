import React from "react";
import { useNavigate } from "react-router";

const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/teams/${team.slug}`)}
      className="grid grid-rows-[1fr_1.5rem_1.5rem] place-items-center p-3 aspect-[1rem] bg-muted/50 rounded-xl cursor-pointer hover:bg-muted/90"
    >
      <img src={team.logo} alt={team.name} className="w-[min(20vw,8rem)] max-h-[8rem] object-contain" />
      <p className="font-semibold text-[min(3.5vw,1rem)]">{team.name}</p>
      <p className="text-xs text-muted-foreground">
        Record:
        <span className="ml-2">
          {team.win} - {team.loss}
        </span>
      </p>
    </div>
  );
};

export default TeamCard;
