import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import PlayerProgressMultiView from "./PlayerProgressMultiView";

const PlayerProgressCompareView = ({ players, teamSlug, dateRangeParams }) => {
  return (
    <Card className="border shadow-sm overflow-hidden card-hover-effect">
      <CardHeader className="bg-muted/30 pb-3 border-b">
        <div className="flex items-baseline justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary/70" />
            Team Comparison
          </CardTitle>
          <CardDescription>
            Compare performance metrics across multiple players
          </CardDescription>

          {players.length > 0 && (
            <Badge variant="outline" className="ml-2 bg-primary/10">
              {players.length} Players
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <PlayerProgressMultiView
          players={players.map((p) => ({
            id: p.id,
            user_id: p.user_id,
            name: p.name,
          }))}
          teamSlug={teamSlug}
          dateRange={dateRangeParams}
        />
      </CardContent>
    </Card>
  );
};

export default PlayerProgressCompareView;
