import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TeamCard = ({ team, onClick }) => (
  <Card
    className="group shadow-sm border cursor-pointer hover:border-primary/60 hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-background to-muted/20"
    onClick={() => onClick(team.slug)}
  >
    <CardContent className="p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
          <AvatarImage src={team.logo} alt={team.name} />
          <AvatarFallback className="text-xs sm:text-sm font-medium bg-primary/10 text-primary">
            {team.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm sm:text-base truncate text-foreground group-hover:text-primary transition-colors">
            {team.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {team.sport_name || "Sport"}
          </p>
        </div>
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
      </div>
    </CardContent>
  </Card>
);

export default TeamCard;
