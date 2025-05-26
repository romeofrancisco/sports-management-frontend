import React from "react";
import InfoCard from "@/components/common/InfoCard";
import { Award, BarChart2, CheckSquare, Shield, Trophy, TrendingUp } from "lucide-react";

/**
 * Component for displaying point-based sport statistics cards
 * @param {Object} statsSummary - Summary statistics
 */
export const PointsBasedStatsCards = ({ statsSummary }) => {
  return (
    <>
      <InfoCard 
        title="Avg Points Per Game" 
        value={statsSummary.avgPointsPerGame}
        icon={<BarChart2 className="text-amber-600 h-5 w-5" />}
      />
        <InfoCard 
        title="Best Offensive Team" 
        value={statsSummary.bestOffensiveTeam.name}
        description={`${statsSummary.bestOffensiveTeam.value} pts/game`}
        icon={<TrendingUp className="text-red-900 h-5 w-5" />}
      />
      
      <InfoCard 
        title="Best Defensive Team" 
        value={statsSummary.bestDefensiveTeam.name}
        description={`${statsSummary.bestDefensiveTeam.value} pts allowed`}
        icon={<Shield />}
      />
      
      <InfoCard 
        title="Longest Win Streak" 
        value={statsSummary.longestStreak.name}
        description={`${statsSummary.longestStreak.value} consecutive wins`}
        icon={<Award className="text-purple-500 h-5 w-5" />}
      />
    </>
  );
};

/**
 * Component for displaying set-based sport statistics cards
 * @param {Object} statsSummary - Summary statistics
 */
export const SetsBasedStatsCards = ({ statsSummary }) => {
  return (
    <>
      <InfoCard 
        title="Best Win Rate" 
        value={statsSummary.bestWinRateTeam.name}
        description={`${statsSummary.bestWinRateTeam.value}% wins`}
        icon={<Trophy className="text-amber-600 h-5 w-5" />}
      />
        <InfoCard 
        title="Best Offensive Team" 
        value={statsSummary.bestOffensiveTeam.name}
        description={`${statsSummary.bestOffensiveTeam.value} pts/set avg`}
        icon={<TrendingUp className="text-red-900 h-5 w-5" />}
      />
      
      <InfoCard 
        title="Best Defensive Team" 
        value={statsSummary.bestDefensiveTeam.name}
        description={`${statsSummary.bestDefensiveTeam.value} pts allowed/set avg`}
        icon={<Shield className="text-amber-500 h-5 w-5" />}
      />
      
      <InfoCard 
        title="Longest Sets Win Streak" 
        value={statsSummary.longestStreak.name}
        description={`${statsSummary.longestStreak.value} consecutive sets`}
        icon={<CheckSquare className="text-purple-500 h-5 w-5" />}
      />
    </>
  );
};
