import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Users, MapPin } from "lucide-react";

/**
 * Minimalist Player profile section component
 */
const PlayerProfileSection = ({ user, personalStats, teamInfo }) => {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="size-14 border-2 border-primary/20">
              <AvatarImage 
                src={user?.profile} 
                alt={`${user?.first_name} ${user?.last_name}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-semibold">
                {user?.first_name} {user?.last_name}
              </CardTitle>
              <CardDescription className="text-sm">
                Player Profile
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
            #{personalStats?.jersey_number || "N/A"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Team and Position */}
        <div className="flex justify-around">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              Team
            </div>
            <div className="font-medium text-sm">{teamInfo?.name || "Not assigned"}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Positions
            </div>
            <div className="flex flex-wrap gap-1">
              {personalStats?.positions?.length > 0 ? (
                personalStats.positions.map((position, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                    {position}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Not assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="border-t pt-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
            <div className="space-y-0.5">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Height</div>
              <div className="font-semibold text-primary text-sm">
                {personalStats?.height ? `${personalStats.height} cm` : "N/A"}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Weight</div>
              <div className="font-semibold text-primary text-sm">
                {personalStats?.weight ? `${personalStats.weight} kg` : "N/A"}
              </div>
            </div>
            <div className="space-y-0.5 col-span-2 md:col-span-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Sport</div>
              <div className="font-semibold text-primary text-sm">
                {teamInfo?.sport || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfileSection;
