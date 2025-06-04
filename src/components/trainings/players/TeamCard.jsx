import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TeamCard = ({ team, onClick }) => (
  <Card
    className="group relative shadow-md border-0 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-background via-background to-muted/30 hover:from-primary/5 hover:to-secondary/10 overflow-hidden"
    onClick={() => onClick(team.slug)}
  >
    {/* Hover gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-300" />
    
    <CardContent className="relative p-4 sm:p-5">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300">
            <AvatarImage src={team.logo} alt={team.name} />
            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/10 to-secondary/10 text-primary group-hover:from-primary/20 group-hover:to-secondary/20">
              {team.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Team status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-background"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
            {team.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate flex items-center gap-1">
            <span className="w-2 h-2 bg-secondary/40 rounded-full flex-shrink-0"></span>
            {team.sport_name || "Sport"}
          </p>
        </div>
        
        <div className="flex-shrink-0 p-2 rounded-full bg-muted/20 group-hover:bg-primary/10 transition-all duration-300">
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TeamCard;
