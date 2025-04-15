import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TeamActions from "./TeamActions";
import { getDivisionLabel } from "@/constants/team";

const TeamCard = ({ team, onView, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-background flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-3">
        <Avatar>
          <AvatarImage src={team.logo} alt={team.name} />
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold">{team.name}</h2>
          <p className="text-sm text-muted-foreground">
            {team.sport?.name} - {getDivisionLabel(team.division)}
          </p>
        </div>

        <TeamActions onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <div className="text-sm text-muted-foreground mt-auto">
        Record: <span className="font-semibold">{team.record.win}</span>W -{" "}
        <span className="font-semibold">{team.record.loss}</span>L
      </div>
    </div>
  );
};

export default TeamCard;
