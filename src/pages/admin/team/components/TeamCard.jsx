import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TeamActions from "./TeamActions";
import { getDivisionLabel } from "@/constants/team";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const TeamCard = ({ team, onView, onEdit, onDelete }) => {
  return (
    <Card className="rounded-lg shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={team.logo} alt={team.name} />
            <AvatarFallback>{team.name[0]}</AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-sm font-medium">{team.name}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {getDivisionLabel(team.division)}
            </p>
          </div>
        </div>
        <TeamActions onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </CardHeader>
    </Card>
  );
};

export default TeamCard;
