import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PlayerCard = ({ player, onClick }) => (
  <Card
    className="shadow-sm border cursor-pointer hover:border-primary/60 transition-colors"
    onClick={() => onClick(player.id)}
  >
    <CardContent className="p-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={player.profile} alt={player.full_name} />
          <AvatarFallback>
            {player.first_name?.charAt(0).toUpperCase() || ''}
            {player.last_name?.charAt(0).toUpperCase() || ''}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{player.full_name}</h3>
          <p className="text-xs text-muted-foreground">
            {player.team?.name || "No team assigned"}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

export default PlayerCard;
