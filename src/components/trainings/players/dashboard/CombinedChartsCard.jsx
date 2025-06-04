import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp, Activity } from "lucide-react";
import PlayerProgressChart from "@/components/charts/PlayerProgressChart/PlayerProgressChart";
import { PlayerRadarChartContainer } from "@/components/charts/PlayerRadarChart";

const CombinedChartsCard = ({ 
  playerId, 
  playerName, 
  dateRange, 
  openModal, 
  className = "" 
}) => {
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Performance Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Progress Chart Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Performance Trends
              </h3>
              <p className="text-sm text-muted-foreground">
                Track progress over time with detailed metrics
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live data
            </div>
          </div>          <div className="bg-gradient-to-br from-background/80 via-background/60 to-muted/20 rounded-xl p-6 border border-border/20 backdrop-blur-sm min-h-[400px]">
            <PlayerProgressChart
              playerId={playerId}
              dateRange={dateRange}
              openModal={openModal}
              showDateControls={false}
              showPerformanceAnalysis={false}
            />
          </div>
        </div>

        {/* Radar Chart Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-secondary/15 to-primary/15 rounded-lg">
              <PieChart className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Skills Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Multi-dimensional performance breakdown across training categories
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Analyzed
            </div>
          </div>
          <div className="bg-gradient-to-br from-background/80 via-background/60 to-muted/20 rounded-xl p-6 border border-border/20 backdrop-blur-sm min-h-[400px]">
            <PlayerRadarChartContainer
              playerId={playerId}
              playerName={playerName}
              dateRange={dateRange}
              showDateControls={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedChartsCard;
