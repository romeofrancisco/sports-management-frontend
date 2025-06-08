import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

/**
 * Enhanced Player profile section component
 */
const PlayerProfileSection = ({ user, personalStats, teamInfo }) => {
  return (
    <Card className="bg-card shadow-lg border-2 border-secondary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gradient">
              Player Profile
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your personal information and team details
            </CardDescription>
          </div>
        </div>
      </CardHeader>      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
            <div className="text-sm text-muted-foreground font-medium">Name</div>
            <div className="font-semibold text-foreground">
              {user?.first_name} {user?.last_name}
            </div>
          </div>
          <div className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
            <div className="text-sm text-muted-foreground font-medium">Team</div>
            <div className="font-semibold text-foreground">
              {teamInfo?.name || "Not assigned"}
            </div>
          </div>
          <div className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
            <div className="text-sm text-muted-foreground font-medium">Positions</div>            <div className="font-semibold text-foreground">
              {personalStats?.positions?.join(", ") || "Not assigned"}
            </div>
          </div>
          <div className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
            <div className="text-sm text-muted-foreground font-medium">Jersey Number</div>
            <Badge variant="outline" className="font-semibold">
              #{personalStats?.jersey_number || "N/A"}
            </Badge>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mt-6 pt-4 border-t border-secondary/20">
          <div className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
            <div className="text-sm text-muted-foreground font-medium">Height</div>
            <div className="font-semibold text-foreground">{personalStats?.height} cm</div>
          </div>
          <div className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
            <div className="text-sm text-muted-foreground font-medium">Weight</div>
            <div className="font-semibold text-foreground">{personalStats?.weight} kg</div>
          </div>
          <div className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
            <div className="text-sm text-muted-foreground font-medium">Sport</div>
            <div className="font-semibold text-foreground">{teamInfo?.sport || "N/A"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfileSection;
