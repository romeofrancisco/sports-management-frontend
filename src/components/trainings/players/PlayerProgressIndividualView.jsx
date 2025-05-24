import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import PlayerProgressChart from "@/components/charts/PlayerProgressChart/PlayerProgressChart";
import PlayerProgressStats from "./PlayerProgressStats";

const PlayerProgressIndividualView = ({
  playerId,
  playerName,
  dateRangeParams,
  handleBackToCompare,
}) => {
  return (
    <Card className="shadow-sm border overflow-hidden pt-0">
      <CardHeader className="bg-muted/30 pb-2 border-b py-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 transition-colors"
              onClick={handleBackToCompare}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <CardTitle className="text-lg font-semibold">
                {playerName || "Player"}'s Progress
              </CardTitle>
              <CardDescription>
                Track individual performance over time
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <PlayerProgressStats playerId={playerId} />
      
      <PlayerProgressChart
        playerId={playerId}
        dateRange={dateRangeParams}
      />
    </Card>
  );
};

export default PlayerProgressIndividualView;
