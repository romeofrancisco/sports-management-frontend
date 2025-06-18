import React from "react";
import PlayerProgressStats from "./PlayerProgressStats";
import {
  PerformanceInsightCard,
  RadarAnalysisSummaryCard,
  ProgressChartCard,
  RadarChartCard,
  CategoryBreakdown,
  QuickActionsCard,
} from "./dashboard";
import { usePlayerRadarChart } from "@/hooks/useTrainings";

const PlayerProgressIndividualView = ({ playerId, playerName, dateRange }) => {
  // Get radar data for the CategoryBreakdown component
  const { data: radarData } = usePlayerRadarChart(
    playerId,
    dateRange,
    !!playerId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="space-y-6">
        {/* Performance Stats Overview */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <PlayerProgressStats playerId={playerId} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Charts Section - Takes up most space */}
          <div className="xl:col-span-8 space-y-6">
            {/* Progress Chart */}
            <div className="animate-in fade-in-50 duration-500 delay-200">
              <ProgressChartCard playerId={playerId} dateRange={dateRange} />
            </div>            {/* Radar Chart */}
            <div className="animate-in fade-in-50 duration-500 delay-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* Radar Chart - Takes 1 column */}
                <div className="flex">
                  <RadarChartCard
                    playerId={playerId}
                    playerName={playerName}
                    dateRange={dateRange}
                    className="w-full h-full"
                  />
                </div>

                {/* Category Breakdown - Takes 1 column */}
                <div className="flex">
                  <CategoryBreakdown 
                    categories={radarData?.categories || []} 
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Insights and Actions */}
          <div className="xl:col-span-4 grid xl:block xl:grid-cols-1 grid-cols-1 md:grid-cols-2 gap-6 xl:space-y-6">
            {/* Performance Insights */}
            <div className="animate-in fade-in-50 duration-500 delay-400">
              <PerformanceInsightCard
                playerId={playerId}
                dateRange={dateRange}
                className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30"
              />
            </div>

            {/* Radar Analysis Summary */}
            <div className="animate-in fade-in-50 duration-500 delay-500">
              <RadarAnalysisSummaryCard
                playerId={playerId}
                dateRange={dateRange}
                className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-secondary/20 transition-all duration-300 hover:shadow-2xl hover:border-secondary/30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProgressIndividualView;
