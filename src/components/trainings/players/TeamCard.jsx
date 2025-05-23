import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TeamCard = ({ team, onClick }) => (
  <Card
    className="shadow-sm border cursor-pointer hover:border-primary/60 transition-colors"
    onClick={() => onClick(team.slug)}
  >
    <CardContent className="p-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={team.logo} alt={team.name} />
          <AvatarFallback>{team.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{team.name}</h3>
          <p className="text-xs text-muted-foreground">
            {team.sport_name || "Sport"}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

export default TeamCard;
