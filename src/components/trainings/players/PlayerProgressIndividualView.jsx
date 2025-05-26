import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, User, TrendingUp } from "lucide-react";
import PlayerProgressChart from "@/components/charts/PlayerProgressChart/PlayerProgressChart";
import PlayerProgressStats from "./PlayerProgressStats";

const PlayerProgressIndividualView = ({
  playerId,
  playerName,
  dateRangeParams,
  handleBackToCompare,
  onDateChange,
  dateRange, // Add dateRange prop for the chart component
}) => {
  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 border-0 shadow-lg overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 rounded-full hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10 shadow-sm"
              onClick={handleBackToCompare}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back to comparison</span>
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {playerName || "Player"}'s Progress
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Comprehensive performance analysis and tracking
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Section with Enhanced Spacing */}
      <div className="px-1">
        <PlayerProgressStats playerId={playerId} />
      </div>
      
      {/* Chart Section with Improved Container */}
      <Card className="bg-gradient-to-br from-background to-muted/20 overflow-hidden">
        <CardContent className="p-0">
          <PlayerProgressChart
            playerId={playerId}
            dateRange={dateRange}
            onDateChange={onDateChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProgressIndividualView;
