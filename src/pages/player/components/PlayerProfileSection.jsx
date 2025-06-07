import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

/**
 * Player profile section displaying personal information
 */
const PlayerProfileSection = ({ user, personalStats, teamInfo }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent" />
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary shadow-lg">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          Player Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-sm text-muted-foreground">Name</div>
            <div className="font-semibold">
              {user?.first_name} {user?.last_name}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Team</div>
            <div className="font-semibold">
              {teamInfo?.name || "Not assigned"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Positions</div>
            <div className="font-semibold">
              {personalStats?.positions?.join(", ") || "Not assigned"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Jersey Number</div>
            <Badge variant="outline" className="font-semibold">
              #{personalStats?.jersey_number || "N/A"}
            </Badge>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mt-4 pt-4 border-t">
          <div>
            <div className="text-sm text-muted-foreground">Height</div>
            <div className="font-semibold">{personalStats?.height} cm</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Weight</div>
            <div className="font-semibold">{personalStats?.weight} kg</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Sport</div>
            <div className="font-semibold">{teamInfo?.sport || "N/A"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfileSection;
