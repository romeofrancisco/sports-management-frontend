import React from "react";
import InfoCard from "@/components/common/InfoCard";
import { Award, BarChart2, CheckSquare, Shield, Trophy, TrendingUp } from "lucide-react";

const LeagueStatCards = ({ statsSummary, isSetsScoring }) => {
  if (isSetsScoring) {
    // Sets-based sports stats cards (volleyball, tennis, etc.)
    return (
      <>
        <InfoCard 
          title="Best Win Rate"
          value={statsSummary.bestWinRateTeam.name}
          icon={<Trophy className="h-5 w-5" />}
          description={`${statsSummary.bestWinRateTeam.value}% wins`}
        />
        
        <InfoCard 
          title="Best Offensive Team"
          value={statsSummary.bestOffensiveTeam.name}
          icon={<TrendingUp className="h-5 w-5" />}
          description={`${statsSummary.bestOffensiveTeam.value} pts/set avg`}
        />
        
        <InfoCard 
          title="Best Defensive Team"
          value={statsSummary.bestDefensiveTeam.name}
          icon={<Shield className="h-5 w-5" />}
          description={`${statsSummary.bestDefensiveTeam.value} pts allowed/set avg`}
        />
        
        <InfoCard 
          title="Longest Sets Win Streak"
          value={statsSummary.longestStreak.name}
          icon={<CheckSquare className="h-5 w-5" />}
          description={`${statsSummary.longestStreak.value} consecutive sets`}
        />
      </>
    );
  }

  // Points-based sports stats cards (basketball, etc.)
  return (
    <>
      <InfoCard 
        title="Avg Points Per Game"
        value={statsSummary.avgPointsPerGame}
        icon={<BarChart2 className="h-5 w-5" />}
      />
      
      <InfoCard 
        title="Best Offensive Team"
        value={statsSummary.bestOffensiveTeam.name}
        icon={<TrendingUp className="h-5 w-5" />}
        description={`${statsSummary.bestOffensiveTeam.value} pts/game`}
      />
      
      <InfoCard 
        title="Best Defensive Team"
        value={statsSummary.bestDefensiveTeam.name}
        icon={<Shield className="h-5 w-5" />}
        description={`${statsSummary.bestDefensiveTeam.value} pts allowed`}
      />
      
      <InfoCard 
        title="Longest Win Streak"
        value={statsSummary.longestStreak.name}
        icon={<Award className="h-5 w-5" />}
        description={`${statsSummary.longestStreak.value} consecutive wins`}
      />
    </>
  );
};

export default LeagueStatCards;